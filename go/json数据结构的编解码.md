工具包：“encoding/json”

一般对切片进行编码

json1,_ := json.Marshal(stus1)

这里的stus1可以是结构体也可以是切片

解码：

err:=json.Unmarshal(str,&stu)

str是json格式的变量，stu是装解析后的数据的变量，需传指针。

