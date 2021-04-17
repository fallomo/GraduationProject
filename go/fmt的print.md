#### 1、可以自己实现Stringer接口的String()，从而控制输出

如果是通过`%s`打印，或者直接调用的`Println`，就会判断打印的对象是否实现了Stringer接口。

如果有，则调用这个对象的String()方法，这个方法只输出字符串。

如果定义如下：

```go
type X string
func (x X) String() string { return fmt.Sprintf("<%s>", x) }
```

则会出现递归死循环。最后导致该协程的栈溢出。原因：在实现String方法时，使用了fmt.Sprintf()进行%s输出，则这个函数会再次判断是否实现了string函数，然后进行调用，从而形成递归死循环。

改进：

```go
type X string
func (x X) String() string { return fmt.Sprintf("<%s>",string(x)) }
//直接将x对象转成string对象，则不会出现判断String()方法的情况。
```

[参考fmt包的底层原理解析](https://blog.cyeam.com/golang/2018/09/10/fmt)

#### 2、可以自己实现Formatter接口的Format(f fmt.State, c rune)方法

用于自己定义格式化输出的结果。

fmt.State中装着 从Printf语句中读取到的 宽度、精度、标志位 三种控制符。

c rune 是格式化输出的占位符。 %v中的v



#### 3、如果自己实现上面两种方法的任意一种，则打印函数会使用反射来调用自定义的方法

#### 4、函数`printArg`()中进行格式化转换，将打印的变量，转换成格式控制的形式

在这个函数中，

- 每种内置类型都有自己的格式化实现，这样就***避免了反射\***；
- 如果不是内置类型，判断是否实现了`Formatter`接口，如果实现了调用此接口；
- 如果需要转成字符串，而对象实现了`Stringer`接口，调用其`String`方法转换；
- 上面两个逻辑在函数`func (p *pp) handleMethods(verb rune) (handled bool)`中，如果能通过接口实现转换，返回`true`并格式化数据，否则返回`false`；(其实还有一些细节的逻辑，例如`GoStringer`，我就不展开细说了)
- 如果通过上面的转换失败，则需要使用默认转换策略。

默认转换策略 p.printValue(reflect.ValueOf(f), verb, 0)，是通过反射实现的。



#### 5、Printf()/Print()/Println()

Printf是严格按照格式化输出

Print 是不按照格式化输出

Println在Print的基础上，会在输出末尾加上换行符，还会在操作数之间输出空白符



#### 6、Printf()的完整流程

1、调用 Fprintf(os.Stdout, format, a...)，指定输出的终点os.Stdout，并调用2

2、创建一个Printer，调用doPrintf(format string, a []interface{})

3、从format中，解析出格式控制符（宽度，精度，标志）以及占位符，将宽度，精度，标志存进结构fmt.State中。

4、调用printArg(a[argNum], verb)，进行格式化转换编码

如果对象值是空的，则直接打印“ ”

如果格式是%T（类型）或%P（指针），使用反射得到结果并打印

如果是别的内置类型，则用switch case按情况转换

如果是自定义类型，则先判断有没有实现 String(),或者Format()，有就通过反射直接调用

如果自定义类型没实现上述两个接口之一，则使用p.printValue(reflect.ValueOf(f), verb, 0)反射得到内容，比如，自定义的结构体，就会输出{内容}。



Print()函数也大致一样，只不过格式化默认为%v



总结：**从格式化的完整流程中可以发现，底层格式化算法是有对性能优化的，那就是通过对每种内置对象单独编写格式化实现来规避反射来提高性能。**

**实际工作中经常需要对系统内复杂结构进行格式化，那么为这些对象实现`Formatter`接口也算是一种提升性能的有效方式。**



#### 7、error也有类似stringer的接口，用于自定义错误输出，打印函数在遇到error类型的时候，也会判断但前对象是否实现了Error()string方法。

