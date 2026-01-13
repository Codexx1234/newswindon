import bcrypt
import sys
import json

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

if __name__ == "__main__":
    action = sys.argv[1]
    if action == "hash":
        password = sys.argv[2]
        print(hash_password(password))
    elif action == "check":
        password = sys.argv[2]
        hashed = sys.argv[3]
        if check_password(password, hashed):
            print("true")
        else:
            print("false")
