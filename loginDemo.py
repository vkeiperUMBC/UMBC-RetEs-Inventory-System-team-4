
#for testing purposes
def printMenu():
	print ("Please pick an option below")
	print("You're an admin logging in: 1")
	print ("You're a student logging in: 2")
	print("If you would like to exit the program: 3")

def option(choice):
	choice = int(choice)
	if (choice == 1):
		choice = adminLogin();
	elif (choice  == 2):
		choice = stuLogin();
	elif (choice == 3):
		choice = -1;
	else:
		print("Invalid option please try again")
		choice = 0;
	return choice


def adminLogin():
	adminUser = "admin@umbc.edu"
	adminPass = "admin123"
	flag = False
	while (flag == False):
		userInput = input("Please enter a username: ")
		user = userInput.rstrip()
		if (user != "admin@umbc.edu"):
			print ("Invalid username please try again.")
		else:
			flag = True


	passFlag = False

	while (passFlag == False):
		userInput = input("Please enter a password: ")
		password = userInput.rstrip()
		if (password != adminPass):
			print("Invalid password please try again.")
		else:
			passFlag = True
	return 1

def stuLogin():
	stuUser = "stu@umbc.edu"
	stuPass = "stu123"
	userFlag = False
	passFlag = False

	while (userFlag == False):
		userInput = input("Please enter a username: ")
		user = userInput.rstrip()
		if (user != stuUser):
			print("Invalid username please try again.")
		else:
			userFlag = True

	while (passFlag == False):
		userInput = input("Please enter a password: ")
		password = userInput.rstrip()
		if (password != stuPass):
			print("Invalid password please try again.")
		else:
			passFlag = True
	return 2

if __name__ == '__main__':
	def main():
		choice = 0
		quitFlag = False
		while(quitFlag == False):
			printMenu();
			userInput = input("Please select an option: ")
			choice = userInput.rstrip()
			choice = option(choice)
			choice = int(choice)

			if (choice == 1):
				print("sucessful admin login")
				quitFlag = True
			elif (choice == 2):
				print("succesful stu login")
				quitFlag = True
			else:
				print("Have a good day!")
				quitFlag = True
main()
