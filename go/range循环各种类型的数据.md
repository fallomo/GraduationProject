[参考](https://studygolang.com/articles/20049)

![image-20201218154803011](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201218154803011.png)

range循环数组或者slice的指针需要注意的：

```go
func myappend(k *[]int) {
	for i := range *k {
		(*k)[i] += 1
	}
}
//注意使用下标的时候，前面的*k需要括号
```

