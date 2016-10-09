from __init__ import app
from gevent.wsgi import WSGIServer
import sys

# Main function
if __name__ == "__main__":
	host, port = "0.0.0.0", 8000
	if len(sys.argv) >= 3:
		host = sys.argv[1]
		port = sys.argv[2]

	#app.run(host=host, port=port, debug=True)
	server = WSGIServer(("",5000), app)
	server.serve_forever()