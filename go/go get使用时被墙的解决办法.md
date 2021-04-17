#### 1、使用国内镜像，此方式需要用 go moudle来管理包

#### 2、在使用go get 的时候，加参数 -v查看下载过程，并看看哪些包没下载成功，到github上找它的资源进行下载

![image-20201125113318383](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201125113318383.png)

- 看到encoding/prototext没下载成功，则访问原文件网址https://google.golang.org/protobuf/encoding/prototext

  ![image-20201125113528529](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201125113528529.png)

- 点击红线网址，并且注意观察 import "google.golang....."字样，这是告诉你引用方式以及下载到本地的路径

  ![image-20201125113607672](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201125113607672.png)

- 右侧显示了github仓库地址
- 点击进去找到对应的包覆之仓库链接
- 回到终端使用git clone下载到对应的文件夹
- git clone https://github.com/protocolbuffers/protobuf-go/ /$GOPATH/src/google.golang.org/protobuf
- 注意 git clone只能拷贝整个仓库，无法拷贝单个文件夹，这里的本地路径/$GOPATH/src/golang.org/protobuf是由上面第一张图中对应的出错的import path 
- 最后再次使用 go get 来检查自己下载的包是否下错或者放错位置

[参考](https://www.cnblogs.com/ww01/p/10621834.html)