在传输数据时，struct和json的数据存储方式是非常相似的，因此，可以将数据转成json来传输。

struct里的字段名首字母要大写才会被解析成json(否则会被忽略)，可以在定义的时候 使用      ``包裹住字段在json里显示的别名。比如：

```go
type data struct{
  ID string `json:"id"`
  Name string `json:"name"`
  Port int `json:"port,omitempty"`
}
//可以选择的控制字段有三种：
// -：不要解析这个字段
// omitempty：当字段为空（默认值）时，不要解析这个字段。比如 false、0、nil、长度为 0 的 array，map，slice，string
// FieldName：当解析 json 的时候，使用这个名字
```

将数据解析成json时，使用函数 

json.Mashal(要解析的变量) 

反解析使用unmashal()