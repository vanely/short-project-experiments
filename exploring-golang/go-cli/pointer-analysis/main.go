package main

import "fmt"

func noPointer() string {
	return "string"
}

func pointerTest() *string {
	return nil // cannot return nil from a function that returns a string
	// but we can return nil from a function that returns a pointer to string
	// nil is the 0 value of a pointer
}

func pointerTestTwo() *string {
	s := "string" // %"string" doesn't work
	return &s
}

func main() {
	fmt.Println(noPointer())      // prints string
	fmt.Println(pointerTest())    // prints <nil>
	fmt.Println(pointerTestTwo()) // prints memory address

	str := pointerTestTwo() // str will store will return the memory location from function
	actualStr := *str       // pointer to str will return value at memory location
	fmt.Printf("\npointer to string: %v\nactual string: %v\n", str, actualStr)

	// -----------------------------------------------------------------------
	// everything in Go is passed by value, without reference to original object.
	
	type User struct {
		Name string
		pets []string
	}
	
	func (u User) newPet() {
		u.Pets = append(u.Pets, "Lucy")
		fmt.Println(u)
	}
}