from flask import Flask, render_template, request, json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/signUp')
def signUp():
    return render_template('signUp.html')


@app.route('/elements')
def elements():
    return render_template('elements.html')


@app.route('/test', methods=['POST'])
def signUpUser():
    user = request.form['username']
    password = request.form['password']
    return json.dumps({'status': 'OK', 'user': user, 'pass': password});


if __name__ == "__main__":
    app.run(host='0.0.0.0')
