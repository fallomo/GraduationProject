是一套微服务工具集。提供多种服务注册与发现的组件，比如zookeeper、consul、etcd等

项目结构组织：

1、transport层。对外暴露HTTP服务接口，即将服务接口给http.Handler。http通过ListenAndServer监听连接，连接产生时转交给`http.Handler`处理。



2、endpoint层。接受请求，并调用服务层提供的接口，将返回结果封装到response，返回给调用者。通常使用一个抽象的Endpoint来表示每个服务提供的方法。

3、service层。业务代码实现层。