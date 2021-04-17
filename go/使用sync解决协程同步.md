```go
var wg sync.WaitGroup

func main() {
	c1 := make(chan int, 5)
	wg.Add(1)
	go func() {
		for i := 0; i < 5; i++ {
			c1 <- i
		}
		time.Sleep(2 * time.Second)
		close(c1)
	}()
	wg.Add(1)
	go func() {
		for i := range c1 {
			fmt.Println(i)
		}
		fmt.Println(222)
	}()
	wg.Wait()
}

```

