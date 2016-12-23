from flask import Flask, jsonify, render_template, request
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

# Route that will process the AJAX request, sum up two
# integer numbers (defaulted to zero) and return the
# result as a proper JSON response (Content-Type, etc.)
@app.route('/_add_numbers')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)

if __name__ == '__main__':
    app.run(
        host="127.0.0.1",
        port=int("5000"),
        debug=True
    )
