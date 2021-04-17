go提供了两种prof工具，一个是runtime/pprof对应用程序的性能测试数据，一个是net/http/pprof对http服务的性能测试数据。

#### 1、通过文件方式输出

通过在应用程序代码中植入 runtime/pprof 的API

然后在程序运行时收集，运行完后生成数据文件。

API:

CPU测试数据

pprof.StartCPUProfile(IO.reader)

pprof.StopCPUProfile()



mem测试数据

pprof.WriteHeapProfile(io.reader)



协程测试数据

gpro:=pprof.Lookup("gorutine")

gpro.WriteTo(io.Reader)



生成命令

先编译程序生成 二进制文件，再运行生成.prof文件。

go tool pprof 二进制文件名 .prof文件名

测试的命令：

先进行测试运行：`go test -bench=. -cpuprofile=cpu.prof`

然后`go tool pprof cpu.prof` 	就可以打开交互界面



进入pprof交互界面，可以使用top list svg等命令

top 命令中，flat 代表本函数执行耗时，flat%指运行一个函数占总时间的百分比，sum指前面每一行flat占比总和（即累计flat%），cum指累计量，该函数+该函数调用其他函数的总耗时，cum指cum占cpu的总时间比例。

.prof文件有多种类型，有cpu文件，计算运行时间，有mem文件计算内存消耗情况，有gorutine文件计算协程阻塞情况。

生成火焰图方式：go-torch xxx.prof文件 

**如果程序的运行某个数据量不够大是无法生成具体数据**（比如程序运行很快就结束了）



#### 2、通过http方式输出profile

导入 _"net/http/pprof" 并启动http server就可以了

访问浏览器方式：http://<host>:<port>/debug/pprof/

命令行：go tool pprof http://<host>:<port>/debug/pprof/profile?seconds=10(默认值是30s)

命令行：go-torch -seconds 10 pprof http://<host>:<port>/debug/pprof/profile

当运行这些命令或者访问debug时，会有一个时间段来收集这期间服务处理的性能数据。


