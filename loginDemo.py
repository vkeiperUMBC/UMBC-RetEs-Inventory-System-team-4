#purpose: backend for user log in
#assuming student is logging in with campus ID and umbc pass
#do not have access to that info will be using a dummy stu
#dummy user: student123@umbc.edu
#dummy pass: student123


#in real life login authetication/verif would be handled by UMBC
#purpose would be to retrieve stu log in input -> would "send" to UMBC
#UMBC would send confirmation back that stu is valid

import socket
import hashlib
import time

#receive a message from the client and return it
def receiveMessage():
    full_msg = ""
    while True:
        msg = s.recv(4096)
        if len(msg) > 0:
            full_msg += msg.decode("utf-8")
            return full_msg


#testing purposes
def logExitMenu():
    while True:
        print("Please select one of the following by entering the keyword: ")
        print("1. LOGIN")
        print("2. EXIT")
        choice = input()
        if choice == "LOGIN" or choice == "EXIT":
            s.sendto(choice.encode(), server)
            return choice
        else:
            print("That is not a valid keyword. Please try again.")

#login funtion controls the login process
def logIn():
    #client types in username
    msg = receiveMessage()
    print(msg)
    user = input("User: ")
    userFlag = True
    if user != "student123@umbc.edu":
        userFlag = False
        while(userFlag == False):
            print("Must be a UMBC login")
            user = input("User: ")
            if user == "student123@umbc.edu":
                userFlag = True

    #client sends username to server
    user = "USER" + user
    s.sendto(user.encode(), server)



    msg = receiveMessage()
    print(msg)

    #client types in password
    pswd = input("Pass: ")
    userFlag = True
    if pswd != "student123":
        userFlag = False
        while(userFlag == False):
            print("Password not valid")
            pswd = input("Pass: ")
            if pswd == "student123":
                userFlag = True

   
    s.sendto(server)
    msg = receiveMessage()
    print(msg)
    return msg

