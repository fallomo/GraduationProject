1、首先自定义的包文件需要放在goroot或者gopath目录下。

gopath的目录结构是

gopath下要有src，bin，pkg三个文件夹，首先要确定gopath已经写入到环境变量中了，然后在程序里引入的路径是**需要忽略src文件夹的**，直接引入 src目录下的相应文件就好了。

2、一般写法

比如，我有一个discover2包，绝对路径是$gopath/src/go_workspace/discover_register/discover2/discover.go

则可以按照下面的写法：

import "go_workspace/discover_register/discover2"

3、别名

这是 discover.go的包名和所在文件的包名一样的情况，可以给package取一个别名，这里取的是dis2

则使用以下的写法：

import **dis2** "go_workspace/discover_register/discover2"

4、同一命名空间(使用点)

import **.** "go_workspace/discover_register/discover2"

这样就不用使用点，可以直接使用函数



注意：包作为外部引用的时候，可以不用首字母大写，所在的文件夹名也可以不需要首字母大写。

但是包文件要引用的内容需要。







https://golang.org/doc/code.html