package main

import "fmt"

func main() {
	// equivalent to defining variable with var, and having it's type infered
	conferenceName := "The Spot"
	const conferenceTickets int = 50
	var remainingTickets int = 50
	fmt.Printf("conferenceTickets is of type: %T\nremainingTickets is of type: %T\nconferenceName is of type: %T\n", conferenceTickets, remainingTickets, conferenceName)

	fmt.Printf("\nWelcome to the %v conference.", conferenceName)
	fmt.Printf("\nGet your tickets here to attend\n")

	fmt.Printf("\nTotal number of tickets: %v.\nRemaining tickets: %v.\n", conferenceTickets, remainingTickets)
	var firstName string
	var lastName string
	var email string
	var userTickets int

	// ask user for name, and store in the memory location of 'username'
	fmt.Print("Enter your first name: ")
	fmt.Scan(&firstName)

	fmt.Print("Enter your last name: ")
	fmt.Scan(&lastName)

	fmt.Print("Enter your email address: ")
	fmt.Scan(&email)

	fmt.Print("Enter number of tickets: ")
	fmt.Scan(&userTickets)
	// working with pointers
	// fmt.Printf("\nActual remainingTickets value: %v", conferenceTickets)
	// fmt.Printf("\nMemory location of remainingTickets: %v\n", &remainingTickets)
	userTickets = 2
	fmt.Printf("\nuser %v booked %v tickets", firstName, userTickets)
}
