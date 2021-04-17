gorose是一种ORM工具 （Object Relation Mapping，即对象关系映射，面向对象编程模式与关系型数据库之间的关系映射）

- gorose模型分层

<img src="/Users/jundongchen/Library/Application Support/typora-user-images/image-20210109220717330.png" alt="image-20210109220717330" style="zoom:50%;" />

​	engin 可用于初始化配置模块，并且可以保存下来作为全局使用，engin保存了数据库的配置信息，然后可以调用以下模块的使用。

​	session是数据库操作的真正模块

​	orm,所有的orm操作都在此进行

​	build执行前面模块生成的sql语句

​	driver是数据库驱动器

​	binder所有的操作结果集都存在这里

- 可操作多种数据库包括mysql

- 使用engin.NewOrm()操作数据库时，分两种情况，一种是绑定变量来获取结果，一种是不需要，通过函数的返回值获取结果。

  1、绑定变量

  ```go
  type user gorose.Data
  func (u *user) TableName() string {
  	return "users"
  }
  
  func testsql(){
  	var u=user{}	//必须初始化才能用
  	engin.orm.Table(&u).Qurey()
  	//u可用 map[string]interface{}或者 gorose.Map代替，也可以用 表的映射结构体代替，称为绑定到结构体
  	//如果返回的数据是多条的，需要用切片，否则只能接收到一条数据
  	//形如：[]map[string]interface{},[]gorose.Map,[]gorose.Data
  	//u需要实现TableName方法
  	//当使用同一个engin.orm操作 绑定u的数据库语句时，他们是叠加的
  	//比如：
  	err = conn.Table(&u).Fields("product_name").Where("product_id", "<", 4).Select()
  	err = conn.Limit(10).Offset(1).Select()
  	//u的结果是在前面的语句查询出来的基础上，进行限制条数
    //可使用 conn.Reset()排除之前的参数干扰
  }
  ```

  2、不需要绑定

  ```go
  engin.orm.Table("表名").Query(“完整的sql语句”)//返回两个值，结果和error
  //当传入的table是string时,需要调用Get()或First()才能取到数据，或者直接用table().query()
  //如果同时绑定了结构对象，又用了Get()或First()，则绑定对象内无数据，返回两个值，结果+error,这是为了节省内存
  ```

  3、如果不换 engin.orm（即不使用new新的出来），则使用的查询是在前面查询出的结果的基础上叠加的。使用engin.orm.Reset()可清空

- 使用engin.NewSession()操作时，需要绑定

```
engin.session.Bind(&u).Query()
```

