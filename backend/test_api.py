
import requests

def test():
    try:
        response = requests.get("http://localhost:8000/api/v1/admin/test")
        print(f"Test Route: {response.status_code}")
        print(f"Response: {response.json()}")
        
        response = requests.get("http://localhost:8000/api/v1/admin/users")
        print(f"Users Route: {response.status_code}")
        if response.status_code == 200:
            print("Successfully reached users route (though it might fail auth if no token)")
        else:
            print(f"Detail: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
