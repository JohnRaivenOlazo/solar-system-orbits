from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import math

app = Flask(__name__)
# Configure CORS with your frontend domain
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://solar-system-orbits.vercel.app",
    "https://solar-system-orbits-boo71bn6t-johnraivenolazos-projects.vercel.app",
    "https://solar-system-orbits-git-main-johnraivenolazos-projects.vercel.app"
]}})

# Configuration for planetary visualization
VISUALIZATION_SCALE = 50  # Scale factor to bring planets closer together
BASE_COLORS = {
    'sun': '#FDB813',     # Yellow
    'mercury': '#A0522D', # Brown
    'venus': '#DEB887',   # Beige
    'earth': '#4B6EA9',   # Blue
    'mars': '#CD5C5C',    # Red
    'jupiter': '#DAA520', # Golden
    'saturn': '#F4D03F',  # Light yellow
    'uranus': '#85C1E9',  # Light blue
    'neptune': '#4968AA'  # Dark blue
}

PLANET_RADII = {
    'sun': 2.5,
    'mercury': 0.4,
    'venus': 0.9,
    'earth': 1.0,
    'mars': 0.5,
    'jupiter': 2.0,
    'saturn': 1.7,
    'uranus': 1.4,
    'neptune': 1.3
}

ORBITAL_DISTANCES = {
    'sun': 0,
    'mercury': 10,
    'venus': 15,
    'earth': 20,
    'mars': 30,
    'jupiter': 52,
    'saturn': 95,
    'uranus': 192,
    'neptune': 301
}

# Orbital speeds in orbits per year
ORBITAL_SPEEDS = {
    'sun': 0,
    'mercury': 4.15,    # 365.25/88 days = 4.15 orbits per year
    'venus': 1.62,      # 365.25/225 days = 1.62 orbits per year
    'earth': 1.0,       # 1 orbit per year
    'mars': 0.53,       # 365.25/687 days = 0.53 orbits per year
    'jupiter': 0.084,   # 1/11.86 years = 0.084 orbits per year
    'saturn': 0.034,    # 1/29.46 years = 0.034 orbits per year
    'uranus': 0.012,    # 1/84.01 years = 0.012 orbits per year
    'neptune': 0.006    # 1/164.79 years = 0.006 orbits per year
}

# Rotation speeds in radians per second
ROTATION_SPEEDS = {
    'sun': 2.7e-6,     # ~27 Earth days per rotation
    'mercury': 1.24e-6, # ~59 Earth days per rotation
    'venus': -2.99e-7,  # ~243 Earth days per rotation (negative for retrograde)
    'earth': 7.27e-5,   # 24 hours per rotation
    'mars': 7.09e-5,    # 24.6 hours per rotation
    'jupiter': 1.76e-4, # ~10 hours per rotation
    'saturn': 1.63e-4,  # ~10.7 hours per rotation
    'uranus': 1.01e-4,  # ~17 hours per rotation
    'neptune': 1.09e-4  # ~16 hours per rotation
}

PLANET_INFO = {
    'sun': {
        'mass': '1.989 × 10^30 kg',
        'diameter': '1,392,700 km',
        'dayLength': '27 Earth days',
        'yearLength': 'N/A',
        'description': 'The Sun is the star at the center of our Solar System.',
        'temperature': '5,500°C (surface)',
        'moons': 0
    },
    'mercury': {
        'mass': '3.285 × 10^23 kg',
        'diameter': '4,879 km',
        'dayLength': '176 Earth days',
        'yearLength': '88 Earth days',
        'description': 'Mercury is the smallest and innermost planet in the Solar System.',
        'temperature': '167°C (average)',
        'moons': 0
    },
    'venus': {
        'mass': '4.867 × 10^24 kg',
        'diameter': '12,104 km',
        'dayLength': '243 Earth days',
        'yearLength': '225 Earth days',
        'description': 'Venus is the second planet from the Sun and the hottest planet in our solar system.',
        'temperature': '462°C (average)',
        'moons': 0
    },
    'earth': {
        'mass': '5.972 × 10^24 kg',
        'diameter': '12,742 km',
        'dayLength': '24 hours',
        'yearLength': '365.25 days',
        'description': 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
        'temperature': '15°C (average)',
        'moons': 1
    },
    'mars': {
        'mass': '6.39 × 10^23 kg',
        'diameter': '6,779 km',
        'dayLength': '24 hours 37 minutes',
        'yearLength': '687 Earth days',
        'description': 'Mars is the fourth planet from the Sun and is known as the Red Planet.',
        'temperature': '-63°C (average)',
        'moons': 2
    },
    'jupiter': {
        'mass': '1.898 × 10^27 kg',
        'diameter': '139,820 km',
        'dayLength': '10 hours',
        'yearLength': '12 Earth years',
        'description': 'Jupiter is the largest planet in our Solar System and the fifth planet from the Sun.',
        'temperature': '-110°C (cloud top)',
        'moons': 95
    },
    'saturn': {
        'mass': '5.683 × 10^26 kg',
        'diameter': '116,460 km',
        'dayLength': '10.7 hours',
        'yearLength': '29.5 Earth years',
        'description': 'Saturn is the sixth planet from the Sun and is famous for its prominent ring system.',
        'temperature': '-140°C (average)',
        'moons': 146
    },
    'uranus': {
        'mass': '8.681 × 10^25 kg',
        'diameter': '50,724 km',
        'dayLength': '17 hours',
        'yearLength': '84 Earth years',
        'description': 'Uranus is the seventh planet from the Sun and rotates on its side.',
        'temperature': '-195°C (average)',
        'moons': 27
    },
    'neptune': {
        'mass': '1.024 × 10^26 kg',
        'diameter': '49,244 km',
        'dayLength': '16 hours',
        'yearLength': '165 Earth years',
        'description': 'Neptune is the eighth and farthest known planet from the Sun.',
        'temperature': '-200°C (average)',
        'moons': 14
    }
}

@app.route('/simulation', methods=['GET'])
def get_simulation_data():
    current_date = datetime.now()
    celestial_bodies = []
    
    for planet_id in ORBITAL_DISTANCES.keys():
        # Calculate position based on orbital distance
        orbital_distance = ORBITAL_DISTANCES[planet_id]
        
        # Calculate current angle based on time (simple circular orbit)
        time_factor = current_date.timestamp() / 100000  # Slow down the rotation
        angle = time_factor * ORBITAL_SPEEDS[planet_id]
        
        # Calculate position using polar coordinates
        x = orbital_distance * math.cos(angle)
        y = 0  # Keeping all planets in the same plane for simplicity
        z = orbital_distance * math.sin(angle)
        
        body_data = {
            'id': planet_id,
            'name': planet_id.capitalize(),
            'position': [x, y, z],
            'rotation': ROTATION_SPEEDS[planet_id],  # Rotation speed
            'radius': PLANET_RADII[planet_id],
            'color': BASE_COLORS[planet_id],
            'orbitalSpeed': ORBITAL_SPEEDS[planet_id],
            'orbitalDistance': orbital_distance,
            'orbitalInclination': 0.0 if planet_id == 'sun' else 0.1,  # Small inclination for visualization
            'info': PLANET_INFO[planet_id]
        }
        celestial_bodies.append(body_data)
    
    return jsonify({
        'timeScale': 1,
        'currentTime': 0,
        'celestialBodies': celestial_bodies,
        'simulationDate': {
            'earthYears': current_date.year,
            'formattedDate': current_date.strftime('%B %d, %Y')
        }
    })

@app.route('/simulation/settings', methods=['POST'])
def update_simulation_settings():
    data = request.json
    return jsonify({'status': 'success', 'timeScale': data.get('timeScale', 1)})

@app.route('/simulation/reset', methods=['POST'])
def reset_simulation():
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)



