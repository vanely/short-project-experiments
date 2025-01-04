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
	var username string
	var userTickets int

	// fmt.Scan(username)
	fmt.Printf("\nActual remainingTickets value: %v", conferenceTickets)
	fmt.Printf("\nMemory location of remainingTickets: %v\n", &remainingTickets)
	username = "Tom"
	userTickets = 2
	fmt.Printf("\nuser %v booked %v tickets", username, userTickets)
}
