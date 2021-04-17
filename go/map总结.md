[参考](https://www.cnblogs.com/qcrao-2018/p/10903807.html)

#### 1、map又称列表，键值对形式，有多线程时最好加锁。

一种数据结构用来维护一个集合的数据，有增删查改。

最主要的数据结构有两种，二叉搜索树（红黑树）、哈希查找表

自平衡搜索树法的最差搜索效率是 O(logN)，而哈希查找表最差是 O(N)

遍历自平衡搜索树，返回的 key 序列，一般会按照从小到大的顺序；而哈希查找表则是乱序的。



golang的map底层使用的是hmap

#### 2、map的make函数返回的是指针类型的hmap

因此，当map传入函数时，无论是值传递还是指针传递，更改都会应用到外层



#### 3、hmap是主要结构

count  元素个数

B	桶的对数。即当桶的个数为8，B为3，B记录指数

noverflow 	整型，overflow的近似数

hash0	哈希种子，哈希函数用到

buckets  指针，指向bucket数组，大小为2^B，所谓的"桶"

oldbuckets  unsafe.Pointer 扩容的时候，buckets 长度会是 oldbuckets 的两倍

nevacuate  uintptr	指示扩容进度，小于此地址的 buckets 迁移完成



```go
type bmap struct {
    topbits  [8]uint8
    keys     [8]keytype
    values   [8]valuetype
    pad      uintptr
    overflow uintptr
}
//桶，一个桶最多装8个key
```

#### 4、实际存储

key存在一起，value存在一起

![image-20201218233948864](/Users/jundongchen/Library/Application Support/typora-user-images/image-20201218233948864.png)

为了节省key和value在一起，产生的需要字节对齐的现象

每个 bucket 设计成最多只能放 8 个 key-value 对，如果有第 9 个 key-value 落入当前的 bucket，那就需要再构建一个 bucket ，通过 `overflow` 指针连接起来。

#### 5、当map为nil时，不能向其添加元素，会直接panic，需要使用make添加容量

这一点与channel一样。

#### 6、map只能与nil进行 == 比较

如果想比较两个map是否一样，可以使用 reflect.DeepEqual()