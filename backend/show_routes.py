
import os
import sys

# Adicionar o diretório atual ao sys.path para poder importar main
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from main import app

def show():
    print("Listing all registered routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"Path: {route.path}")
        elif hasattr(route, 'routes'): # Per-mount routes
            for subroute in route.routes:
                print(f"Mount Path: {route.path} -> {subroute.path}")

if __name__ == "__main__":
    show()
