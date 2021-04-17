## 基础内容

相关链接

[Solidity文档翻译系列_黄嘉成的博客-CSDN博客](https://blog.csdn.net/qq_33829547/category_7671122.html)

[智能合约概述 — Solidity develop 文档](https://solidity-cn.readthedocs.io/zh/develop/introduction-to-smart-contracts.html)

### 四种访问权限

public：任何人都可以调用该函数，包括DApp的使用者。
 private：只有合约本身可以调用该函数（在另一个函数中）。
 internal：只有这份合同以及由此产生的所有合同才能称之为合同。
 external：只有外部可以调用该函数，而合约内部不能调用。

### 三种修饰符

view: 可以自由调用，因为它只是“查看”区块链的状态而不改变它
 pure: 也可以自由调用，既不读取也不写入区块链
 payable:常常用于将代币发送给合约地址。

### 函数组成

**function** **函数名** (参数类型1 参数名1，.........., 参数类型n 参数名n) **访问权限**  **修饰符** **returns**(类型1 名字,类型2 名字，。。。,类型n 名字)

访问权限默认为public 

修饰符 如果需要花费gas则不写

### 基本类型

**int** **整型**

`int` / `uint` ：分别表示有符号和无符号的不同位数的整型变量。 支持关键字 `uint8` 到 `uint256` （无符号，从 8 位到 256 位）以及 `int8` 到 `int256`，以 `8` 位为步长递增。 `uint` 和 `int` 分别是 `uint256` 和 `int256` 的别名。

**bool** **布尔值**

**定点数** 

还未完全支持 目前可以用来声明变量，但不可以用来赋值

**地址成员**

```solidity
address x = 0x123;
address myAddress = this;
if (x.balance < 10 && myAddress.balance >= 10) x.transfer(10);
```

余额`balance`和转账`transfer`

可以在Address Related中进行快速参考。

可以使用`balance`属性查询地址的余额，并使用`transfer`函数将以太币（以wei为单位）发送到一个地址：

send `send`与`transfer`的很类似，区别在于，`send` 如果执行失败，当前合约**不会停止并抛出异常**，但`send`将返回`false`。

此外还有call callcode delegatecall等不安全方法

**byte**  **定长字节数组**

一个byte=8个位（XXXX XXXX）X为0或1，二进制表示
 byte数组为bytes1，bytes2，。。。，bytes32，以八个位递增，即是对**位的封装**
 bytes1=uint8
 bytes2=unit16
 ...
 bytes32=unit256

byte是byte1的别名

支持位运算

PS: bytes array = new bytes(length); 为变长字节数组 为 数组 而不是基本类型

**string**
 变长 UTF-8 编码字符串类型，为数组。并不是值类型。

**类型转换**

```
字符串 转 动态数组
string str = "mystr";
bytes b = bytes(str);
动态数组 转 字符串
bytes bs = 0x7a4892;
string str = string(b);
定长字节数组之前可以互相转换
bytes1 b1= 0x7a;
bytes2  b2=bytes2(b1);
定长字节数组 转  动态字节数组
```

**存在但先不讨论**

固定长度数组 

可变长度数组

二维数组

全局变量

映射

### 字面量

地址字面量

有理数和整型字面量

字符串字面量

十六进制字面量

 

###引用类型

应用类型存放在内存memory或储存器storage

每一个复杂类型，即数组`Array`和结构体`Struct`，有一个额外的注解——“数据存储位置”，关系到它是放在在内存还是存储器中。根据上下文会产生一个默认存储位置，但是可以通过`storage` 或`memory` 关键字修饰该类型来改变。

- 函数参数，包括返回值的默认数据存储位置是`memory`
- 局部变量的默认数据存储位置是`storage`
- 状态变量默认数据存储位置强制为`storage`。

其实还有第三个数据存储位置`calldata`，它是**不可修改**的**非持久化**的**函数参数**存储区域。外部函数的函数参数(不包括返回值)被强存储在`calldata`，其表现与`memory`很相似。

数据存储位置很重要，**因为它们会改变赋值的方式**：

- 存储和内存之间的赋值甚至状态变量总是会创建独立副本。
- 本地存储变量的赋值只能指定一个引用，并且该引用始终指向状态变量，即使后者在此期间发生更改。
- 将一个内存存储的引用类型赋值给另一个内存存储引用类型不会创建副本。



## 正式开始

### 公共数组

你可以定义 `public` 数组, Solidity 会自动创建 `getter` 方法. 语法如下:

```cpp
Person[] public people;
```

### 事件和监听

```csharp
// 这里建立事件
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  //触发事件，通知app
  IntegersAdded(_x, _y, result);
  return result;
}
```

```jsx
//js部分
YourContract.IntegersAdded(function(error, result) { 
  // 干些事
}
```

### 映射

```tsx
//对于金融应用程序，将用户的余额保存在一个 uint类型的变量中：
mapping (address => uint) public accountBalance;

//或者可以用来通过userId 存储/查找的用户名
mapping (uint => string) userIdToName;
```

映射本质上是存储和查找数据所用的`键-值`对。在第一个例子中，键是一个 `address`，值是一个 `uint`，在第二个例子中，键是一个`uint`，值是一个 `string`。

### msg.sender

在 Solidity 中，有一些全局变量可以被所有函数调用。 其中一个就是 `msg.sender`，它指的是**当前调用者（或智能合约）**的 `address`。

```jsx
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // 更新我们的 `favoriteNumber` 映射来将 `_myNumber`存储在 `msg.sender`名下
  favoriteNumber[msg.sender] = _myNumber;
  // 存储数据至映射的方法和将数据存储在数组相似
}

function whatIsMyNumber() public view returns (uint) {
  // 拿到存储在调用者地址名下的值
  // 若调用者还没调用 setMyNumber， 则值为 `0`
  return favoriteNumber[msg.sender];
}
```

###require

`require`使得函数在执行过程中，当不满足某些条件时抛出错误，并停止执行：

```tsx
function sayHiToVitalik(string _name) public returns (string) {
  // 比较 _name 是否等于 "Vitalik". 如果不成立，抛出异常并终止程序
  // (敲黑板: Solidity 并不支持原生的字符串比较, 我们只能通过比较
  // 两字符串的 keccak256 哈希值来进行判断)
  require(keccak256(_name) == keccak256("Vitalik"));
  // 如果返回 true, 运行如下语句
  return "Hi!";
}
```

### 继承 inheritance

 当代码过于冗长的时候，最好将`代码和逻辑分拆到多个不同的合约中`，以便于管理。

有个让 `Solidity` 的代码易于管理的功能，就是合约 `inheritance` (继承)：

```jsx
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

由于 `BabyDoge` 是从 `Doge` 那里 `inherits` （继承)过来的。 这意味着当你编译和部署了 `BabyDoge`，它将可以访问 `catchphrase()` 和 `anotherCatchphrase()`和其他我们在 `Doge` 中定义的其他公共函数。

这可以用于逻辑继承（比如表达子类的时候，`Cat` 是一种 `Animal`）。 但也可以简单地将类似的逻辑组合到不同的合约中以组织代码。

可以多重继承

```csharp
contract SatoshiNakamoto is NickSzabo, HalFinney {
  // 啧啧啧，宇宙的奥秘泄露了
}
```

### import

```dart
import "./someothercontract.sol";
```

```python
导入另一个文件不能用单引号，只能用双引号，否则会报错
```

### Storage与Memory

在 Solidity 中，有两个地方可以存储变量 —— `storage` 或 `memory`。

`Storage` 变量是指`永久存储在区块链`中的变量。 `Memory` 变量则是`临时`的，当外部函数对某合约调用完成时，内存型变量即被移除。 你可以把它想象成存储在你电脑的硬盘或是RAM中数据的关系。

大多数时候你都用不到这些关键字，默认情况下 Solidity 会自动处理它们。 状态变量（在函数之外声明的变量）默认为“存储”形式，并永久写入区块链；而在函数内部声明的变量是“内存”型的，它们函数调用结束后消失。

然而也有一些情况下，你需要手动声明存储类型，主要用于处理函数内的 `结构体` 和 `数组` 时：

```cpp
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ 看上去很直接，不过 Solidity 将会给出警告
    // 告诉你应该明确在这里定义 `storage` 或者 `memory`。

    // 所以你应该明确定义 `storage`:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...这样 `mySandwich` 是指向 `sandwiches[_index]`的指针
    // 在存储里，另外...
    mySandwich.status = "Eaten!";
    // ...这将永久把 `sandwiches[_index]` 变为区块链上的存储

    // 如果你只想要一个副本，可以使用`memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...这样 `anotherSandwich` 就仅仅是一个内存里的副本了
    // 另外
    anotherSandwich.status = "Eaten!";
    // ...将仅仅修改临时变量，对 `sandwiches[_index + 1]` 没有任何影响
    // 不过你可以这样做:
    sandwiches[_index + 1] = anotherSandwich;
    // ...如果你想把副本的改动保存回区块链存储
  }
}
```

### 函数可见性

**internal 和 external**

除 `public` 和 `private` 属性之外，Solidity 还使用了另外两个描述函数可见性的修饰词：`internal`（内部） 和 `external`（外部）。

`internal` 和 `private` 类似，不过， **如果某个合约继承自其父合约，这个合约即可以访问父合约中定义的“内部”函数**。（嘿，这听起来正是我们想要的那样！）。

`external` 与`public` 类似，只不过这些函数只能在合约之外调用 - 它们不能被合约内的其他函数调用。稍后我们将讨论什么时候使用 `external` 和 `public`。

```csharp
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // 因为eat() 是internal 的，所以我们能在这里调用
    eat();
  }
}
```

### 接口

####定义

如果我们的合约需要和区块链上的其他的合约会话，则需先定义一个 `interface` (接口)

```jsx
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

```php
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

#### 使用

定义为

```php
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

使用

```csharp
contract MyContract {
  address NumberInterfaceAddress = 0xab38...;
  // ^ 这是FavoriteNumber合约在以太坊上的地址
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress);
  // 现在变量 `numberContract` 指向另一个合约对象

  function someFunction() public {
    // 现在我们可以调用在那个合约中声明的 `getNum`函数:
    uint num = numberContract.getNum(msg.sender);
    // ...在这儿使用 `num`变量做些什么
  }
}
```

### 处理多返回值

```csharp
unction multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // 这样来做批量赋值:
  (a, b, c) = multipleReturns();
}

// 或者如果我们只想返回其中一个变量:
function getLastReturnValue() external {
  uint c;
  // 可以对其他字段留空:
  (,,c) = multipleReturns();
}
```

### 所有权（ownable）函数修饰符

**函数修饰符**：`modifier onlyOwner()`。 修饰符跟函数很类似，不过是用来修饰其他已有函数用的， 在其他语句执行前，为它检查下先验条件。**它不能像函数那样被直接调用，只能被添加到函数定义的末尾，用以改变函数的行为**。

```php
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
```

执行到 `onlyOwner` 中的`_;` 语句时，程序再返回并执行主函数中的代码。

```csharp
// 存储用户年龄的映射
mapping (uint => uint) public age;

// 限定用户年龄的修饰符
modifier olderThan(uint _age, uint _userId) {
  require(age[_userId] >= _age);
  _;
}

// 必须年满16周岁才允许开车 (至少在美国是这样的).
// 我们可以用如下参数调用`olderThan` 修饰符:
function driveCar(uint _userId) public olderThan(16, _userId) {
  // 其余的程序逻辑
}
```

函数修饰符可以带参数

### 自带修饰符的总结

截至目前，我们只接触到很少的 `函数修饰符`。 要记住所有的东西很难，所以我们来个概览：

- 1、我们有决定函数何时和被谁调用的可见性修饰符: `private` 意味着它**只能被合约内部调用**； `internal` 就像 `private` 但是也**能被继承的合约调用**； `external` **只能从合约外部调用**；最后 `public` 可以在任何地方调用，**不管是内部还是外部**。
- 2、我们也有状态修饰符， 告诉我们函数如何和区块链交互: `view` 告诉我们运行这个函数不会更改和保存任何数据； `pure` 告诉我们这个函数不但不会往区块链写数据，它甚至不从区块链读取数据。这两种在被从合约外部调用的时候都不花费任何gas（但是它们在被内部其他函数调用的时候将会耗费gas）。
- 3、然后我们有了自定义的 `modifiers`，例如在第三课学习的: `onlyOwner` 和 `aboveLevel`。 对于这些修饰符我们可以自定义其对函数的约束逻辑。



### 优化

####uint优化

通常情况下我们不会考虑使用 `uint` 变种，因为无论如何定义 `uint`的大小，Solidity 为它保留256位的存储空间。例如，使用 `uint8` 而不是uint（uint256）不会为你节省任何 gas。

除非，把 `uint` 绑定到 `struct` 里面。

如果一个 `struct` 中有多个 `uint`，则尽可能使用较小的 `uint`, Solidity 会将这些 uint 打包在一起，从而占用较少的存储空间。例如：

```go
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// 因为使用了结构打包，`mini` 比 `normal` 占用的空间更少
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30);
```

所以，当 `uint` 定义在一个 `struct` 中的时候，尽量使用最小的整数子类型以节约空间。 并且把同样类型的变量放一起（即在 struct 中将把变量按照类型依次放置），这样 Solidity 可以将存储空间最小化。例如，有两个 `struct`：

```
uint c; uint32 a; uint32 b;` 和 `uint32 a; uint c; uint32 b;
```

前者比后者需要的gas更少，因为前者把`uint32`放一起了。

#### view函数

当玩家从外部调用一个`view`函数，是不需要支付一分 `gas` 的。

#### 昂贵的storage

Solidity 使用 `storage`(存储)是相当昂贵的，”写入“操作尤其贵。

为了降低成本，不到万不得已，避免将数据写入存储。这也会导致效率低下的编程逻辑 - 比如每次调用一个函数，都需要在 `memory`(内存) 中重建一个数组，而不是简单地将上次计算的数组给存储下来以便快速查找。

而 **在内存中声明数组**，在数组后面加上 `memory` 关键字， 表明这个数组是仅仅在内存中创建，不需要写入外部存储，并且在函数调用结束时它就解散了。与在程序结束时把数据保存进 `storage` 的做法相比，内存运算可以大大节省gas开销 -- 把这数组放在`view`里用，完全不用花钱。

以下是申明一个内存数组的例子：

```csharp
function getArray() external pure returns(uint[]) {
  // 初始化一个长度为3的内存数组
  uint[] memory values = new uint[](3);
  // 赋值
  values.push(1);
  values.push(2);
  values.push(3);
  // 返回数组
  return values;
}
```



### 时间单位

Solidity 使用自己的本地时间单位。

变量 `now` 将返回当前的unix时间戳（自1970年1月1日以来经过的秒数）。我写这句话时 unix 时间是 1515527488。

> 注意：Unix时间传统用一个32位的整数进行存储。这会导致“2038年”问题，当这个32位的unix时间戳不够用，产生溢出，使用这个时间的遗留系统就麻烦了。所以，如果我们想让我们的 DApp 跑够20年，我们可以使用64位整数表示时间，但为此我们的用户又得支付更多的 gas。真是个两难的设计啊！

Solidity 还包含秒`(seconds)`，`分钟(minutes)`，`小时(hours)`，`天(days)`，`周(weeks)` 和 `年(years)` 等时间单位。它们都会转换成对应的秒数放入 `uint` 中。所以 1分钟 就是 60，1小时是 3600（60秒×60分钟），1天是`86400`（24小时×60分钟×60秒），以此类推。

```jsx
uint lastUpdated;

// 将‘上次更新时间’ 设置为 ‘现在’
function updateTimestamp() public {
  lastUpdated = now;
}

// 如果到上次`updateTimestamp` 超过5分钟，返回 'true'
// 不到5分钟返回 'false'
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

### payable修饰符

`payable` 方法是一种可以接收eth的特殊函数。

示例

```jsx
contract OnlineStore {
  function buySomething() external payable {
    // 检查以确定0.001以太发送出去来运行函数:
    require(msg.value == 0.001 ether);
    // 如果为真，一些用来向函数调用者发送数字内容的逻辑
    transferThing(msg.sender);
  }
}
```

在这里，`msg.value` 是一种可以查看向合约发送了多少以太的方法，另外 `ether` 是一个內建单元。

这里发生的事是，一些人会从 `web3.js` 调用这个函数 (从DApp的前端)， 像这样 :

```csharp
// 假设 `OnlineStore` 在以太坊上指向你的合约:
OnlineStore.buySomething().send(from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001))
```

注意： 如果一个函数没标记为`payable`， 而你尝试利用上面的方法发送以太，函数将拒绝你的事务。

### 提现

在你发送以太之后，它将被存储进以合约的以太坊账户中， 并冻结在哪里 —— 除非你添加一个函数来从合约中把以太提现。

你可以写一个函数来从合约中提现以太，类似这样：

```jsx
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }
}
```

###随机数

在 Solidity 里如何生成随机数

无法安全地生成随机数

Solidity 中最好的随机数生成器是 `keccak256` 哈希函数.

```csharp
// 生成一个0到100的随机数:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

这个方法首先拿到 `now` 的时间戳、 `msg.sender`、 以及一个自增数 `nonce` （一个仅会被使用一次的数，这样我们就不会对相同的输入值调用一次以上哈希函数了）。

然后利用 `keccak` 把输入的值转变为一个哈希值, 再将哈希值转换为 `uint`, 然后利用 `% 100` 来取最后两位, 就生成了一个0到100之间随机数了。

但**这个方法很容易被不诚实的节点攻击**

在以太坊上, 当你在和一个合约上调用函数的时候, 你会把它广播给一个节点或者在网络上的 `transaction` 节点们。 网络上的节点将收集很多事务, 试着成为第一个解决计算密集型数学问题的人，作为“工作证明”，然后将“工作证明”(Proof of Work, PoW)和事务一起作为一个 `block` 发布在网络上。

一旦一个节点解决了一个PoW, 其他节点就会停止尝试解决这个 PoW, 并验证其他节点的事务列表是有效的，然后接受这个节点转而尝试解决下一个节点。

这就让我们的随机数函数变得可利用了

我们假设我们有一个硬币翻转合约——正面你赢双倍钱，反面你输掉所有的钱。假如它使用上面的方法来决定是正面还是反面 (`random >= 50` 算正面, `random < 50` 算反面)。

如果我正运行一个节点，我可以 只对我自己的节点 发布一个事务，且不分享它。 我可以运行硬币翻转方法来偷窥我的输赢 — 如果我输了，我就不把这个事务包含进我要解决的下一个区块中去。我可以一直运行这个方法，直到我赢得了硬币翻转并解决了下一个区块，然后获利。

**所以我们该如何在以太坊上安全地生成随机数呢 ？**

因为区块链的全部内容对所有参与者来说是透明的， 这就让这个问题变得很难，它的解决方法不在本课程讨论范围，你可以阅读 这个 StackOverflow 上的讨论 来获得一些主意。 一个方法是利用 oracle 来访问以太坊区块链之外的随机数函数。

当然， 因为网络上成千上万的以太坊节点都在竞争解决下一个区块，我能成功解决下一个区块的几率非常之低。 这将花费我们巨大的计算资源来开发这个获利方法 — 但是如果奖励异常地高(比如我可以在硬币翻转函数中赢得 1个亿)， 那就很值得去攻击了。

所以尽管这个方法在以太坊上不安全，在实际中，除非我们的随机函数有一大笔钱在上面，你的用户一般是没有足够的资源去攻击的。但是要谨记它是不安全的。

## ERC20

### method

**name** 返回string类型的ERC20代币的名字，例如：StatusNetwork

**symbol** 返回string类型的ERC20代币的符号，也就是代币的简称，例如：SNT。

**decimals** 支持几位小数点后几位。如果设置为3。也就是支持0.001表示。

**totalSupply **发行代币的总量，可以通过这个函数来获取。所有智能合约发行的代币总量是一定的，totalSupply必须设置初始值。如果不设置初始值，这个代币发行就说明有问题。

**balanceOf** 输入地址，可以获取该地址代币的余额。

**transfer** 调用transfer函数将自己的token转账给_to地址，_value为转账个数

**approve** 批准_spender账户从自己的账户转移_value个token。可以分多次转移。

**transferFrom** 与approve搭配使用，approve批准之后，调用transferFrom函数来转移token。

**allowance** 返回_spender还能提取token的个数。

### Events

**Transfer**

```csharp
event Transfer(address indexed _from, address indexed _to, uint256 _value)
```

当成功转移token时，一定要触发Transfer事件

**Approval**

```csharp
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

当调用approval函数成功时，一定要触发Approval事件

## ERC721

`ERC721代币`是**不能互换的，因为每个代币都被认为是唯一且不可分割的**。 你只能以整个单位交易它们，并且每个单位都有唯一的 ID。

使用像 ERC721 这样的标准的优势就是，我们不必在我们的合约中实现拍卖或托管逻辑，

如果我们符合规范，其他人可以为加密可交易的 ERC721 资产搭建一个交易所平台，我们的 ERC721 僵尸将可以在该平台上使用。 所以使用代币标准相较于使用你自己的交易逻辑有明显的好处。



## web3js

`以太坊网络是由节点组成的，每一个节点都包含了区块链的一份拷贝`。当你想要调用一份智能合约的一个方法，你需要从其中一个节点中查找并告诉它:

- 1、智能合约的地址
- 2、你想调用的方法，以及
- 3、你想传入那个方法的参数

以太坊节点只能识别一种叫做 `JSON-RPC` 的语言。这种语言直接读起来并不好懂。当你你想调用一个合约的方法的时候，需要发送的查询语句将会是这样的：

```json
{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xb60e8dd61c5d32be8058bb8eb970870f07233155","to":"0xd46e8dd67c5d32be8058bb8eb970870f07244567","gas":"0x76c0","gasPrice":"0x9184e72a000","value":"0x9184e72a","data":"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"}],"id":1}
```

而web3js将查询语句都隐藏了起来，仅需与js交互即可实现

```css
CryptoZombies.methods.createRandomZombie("Vitalik Nakamoto")
  .send({ from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155", gas: "3000000" })
```

###实例化

Web3.js 需要两个东西来和你的合约对话: 它的 `地址` 和它的 `ABI`。

在你部署智能合约以后，它将获得一个以太坊上的永久地址。你需要在部署后复制这个地址以来和你的智能合约对话。

另一个 Web3.js 为了要和你的智能合约对话而需要的东西是 ABI。

`ABI` 意为**应用二进制接口（Application Binary Interface）**。 基本上，它是以 JSON 格式表示合约的方法，告诉 Web3.js 如何以合同理解的方式格式化函数调用。

当你编译你的合约向以太坊部署时(我们将后边详述)， Solidity 编译器会给你 ABI，所以除了合约地址，你还需要把这个也复制下来。

```
//testABI.js
var addABI ={
    "accounts": {
      "account{0}": "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    },
    "linkReferences": {},
    "transactions": [
      {
        "timestamp": 1615698284308,
        "record": {
          "value": "0",
          "parameters": [],
          "abi": "0x966ef634da1bf138169512adc239bbc085aa50951d2ca7240aba164a83b76521",
          "contractName": "simpleadd",
          "bytecode": "608060405234801561001057600080fd5b5060f18061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec1146037578063771602f7146053575b600080fd5b603d609c565b6040518082815260200191505060405180910390f35b608660048036036040811015606757600080fd5b81019080803590602001909291908035906020019092919050505060a5565b6040518082815260200191505060405180910390f35b60008054905090565b600081830160008190555060005490509291505056fea2646970667358221220b3a4dfd9cd1154152e1b5d605aadb9bd30f5575fd679f3dde5b4328be404fd4464736f6c63430007040033",
          "linkReferences": {},
          "name": "",
          "inputs": "()",
          "type": "constructor",
          "from": "account{0}"
        }
      },
      {
        "timestamp": 1615698307229,
        "record": {
          "value": "0",
          "parameters": [
            "6",
            "3"
          ],
          "to": "created{1615698284308}",
          "abi": "0x966ef634da1bf138169512adc239bbc085aa50951d2ca7240aba164a83b76521",
          "name": "add",
          "inputs": "(uint256,uint256)",
          "type": "function",
          "from": "account{0}"
        }
      },
      {
        "timestamp": 1615698310936,
        "record": {
          "value": "0",
          "parameters": [
            "6",
            "3"
          ],
          "to": "created{1615698284308}",
          "abi": "0x966ef634da1bf138169512adc239bbc085aa50951d2ca7240aba164a83b76521",
          "name": "add",
          "inputs": "(uint256,uint256)",
          "type": "function",
          "from": "account{0}"
        }
      },
      {
        "timestamp": 1615698332808,
        "record": {
          "value": "0",
          "parameters": [
            "6",
            "9"
          ],
          "to": "created{1615698284308}",
          "abi": "0x966ef634da1bf138169512adc239bbc085aa50951d2ca7240aba164a83b76521",
          "name": "add",
          "inputs": "(uint256,uint256)",
          "type": "function",
          "from": "account{0}"
        }
      }
    ],
    "abis": {
      "0x966ef634da1bf138169512adc239bbc085aa50951d2ca7240aba164a83b76521": [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "fir",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "sec",
              "type": "uint256"
            }
          ],
          "name": "add",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "retrieve",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    }
  }
```



实例化

一旦你有了合约的地址和 ABI，你可以像这样来实例化 Web3.js。

```csharp
// 实例化 myContract
var myContract = new web3js.eth.Contract(myABI, myContractAddress);
```

一个实例化例子

```xml
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>CryptoZombies front-end</title>
    <script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script language="javascript" type="text/javascript" src="web3.min.js"></script>
    <!-- 1\. Include cryptozombies_abi.js here -->
     <script language="javascript" type="text/javascript" src="cryptozombies_abi.js"></script>
  </head>
  <body>

    <script>
      // 2\. Start code here
      var cryptoZombies;

      function startApp() {
        var cryptoZombiesAddress = "你的合约地址";
        cryptoZombies = new Web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
      }

      window.addEventListener('load', function() {

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
          // Use Mist/MetaMask's provider
          web3js = new Web3(web3.currentProvider);
        } else {
          // Handle the case where the user doesn't have Metamask installed
          // Probably show them a message prompting them to install Metamask
        }

        // Now you can start your app & access web3 freely:
        startApp()

      })
    </script>
  </body>
</html>
```

### 调用合约和函数

Web3.js 有两个方法来调用我们合约的函数: `call` and `send`.

**call**

`call` 用来调用 `view` 和 `pure` 函数。它只运行在本地节点，不会在区块链上创建事务。

> `view` 和 `pure` 函数是**只读的并不会改变区块链的状态**。它们也不会消耗任何gas。**用户也不会被要求用MetaMask对事务签名**。

使用 Web3.js，你可以如下 `call` 一个名为`myMethod`的方法并传入一个 123 作为参数：

```css
myContract.methods.myMethod(123).call()
```

 **Send**

`send` 将**创建一个事务并改变区块链上的数据**。你需要用 `send` 来调用任何非 `view` 或者 `pure` 的函数。

>  `send` **一个事务将要求用户支付gas，并会要求弹出对话框请求用户使用 Metamask 对事务签名**。在我们使用 Metamask 作为我们的 web3 提供者的时候，所有这一切都会在我们调用 `send()` 的时候自动发生。而我们自己无需在代码中操心这一切，挺爽的吧。

相对 `call` 函数，`send` 函数有如下主要区别:

- 1、`send` 一个事务需要一个 `from` 地址来表明谁在调用这个函数（也就是你 Solidity 代码里的 `msg.sender` )。 我们需要这是我们 DApp 的用户，这样一来 MetaMask 才会弹出提示让他们对事务签名。
- 2、send 一个事务将花费 gas
- 3、在用户 `send` **一个事务到该事务对区块链产生实际影响之间有一个不可忽略的延迟**。这是因为我们必须等待事务被包含进一个区块里，以太坊上一个区块的时间平均下来是15秒左右。如果当前在以太坊上有大量挂起事务或者用户发送了过低的 `gas` 价格，我们的事务可能需要等待数个区块才能被包含进去，往往可能花费数分钟。

所以需要编写逻辑来处理这部分异步特性。



使用 Web3.js, 你可以像这样 send 一个事务调用myMethod 并传入 123 作为参数：

```css
myContract.methods.myMethod(123).send()
```

ps:例子使用web3js 1.0版本 注意版本问题

```jsx
//简单封装
function getZombieDetails(id) {
  return cryptoZombies.methods.zombies(id).call()
}

// 调用函数并做一些其他事情
getZombieDetails(15)
.then(function(result) {
  console.log("Zombie 15: " + JSON.stringify(result));
});
```

注意这是 **异步的**，就像从外部服务器中调用API。所以 Web3 在这里返回了一个 Promises. 

result格式

```json
{
  "name": "H4XF13LD MORRIS'S COOLER OLDER BROTHER",
  "dna": "1337133713371337",
  "level": "9999",
  "readyTime": "1522498671",
  "winCount": "999999999",
  "lossCount": "0" // Obviously.
}
```

### 订阅事件

在 Web3.js里， 你可以 订阅 一个事件，这样你的 Web3 提供者可以在每次事件发生后触发你的一些代码逻辑：

```jsx
cryptoZombies.events.NewZombie()
.on("data", function(event) {
  let zombie = event.returnValues;
  console.log("一个新僵尸诞生了！", zombie.zombieId, zombie.name, zombie.dna);
}).on('error', console.error);
```

使用indexed

为了筛选仅和当前用户相关的事件，我们的 Solidity 合约将必须使用 `indexed` 关键字，就像我们在 ERC721 实现中的Transfer 事件中那样：

```csharp
event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
```

在这种情况下， 因为`_from` 和 `_to` 都是 `indexed`，这就意味着我们可以在前端事件监听中过滤事件.

```csharp
cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
.on("data", function(event) {
  let data = event.returnValues;
  // 当前用户更新了一个僵尸！更新界面来显示
}).on('error', console.error);
```

 查询过去的事件

我们甚至可以用 `getPastEvents` 查询过去的事件，并用过滤器 `fromBlock` 和 `toBlock` 给 Solidity 一个事件日志的时间范围("block" 在这里代表以太坊区块编号）：

```jsx
cryptoZombies.getPastEvents("NewZombie", { fromBlock: 0, toBlock: 'latest' })
.then(function(events) {
  // events 是可以用来遍历的 `event` 对象 
  // 这段代码将返回给我们从开始以来创建的僵尸列表
});
```

因为你可以用这个方法来查询从最开始起的事件日志，这就有了一个非常有趣的用例： **用事件来作为一种更便宜的存储**。

**若你还能记得，在区块链上保存数据是 Solidity 中最贵的操作之一。但是用事件就便宜太多太多了**。

这里的短板是，事件不能从智能合约本身读取。但是，如果你有一些数据需要永久性地记录在区块链中以便可以在应用的前端中读取，这将是一个很好的用例。这些数据不会影响智能合约向前的状态。

举个栗子，我们可以用事件来作为僵尸战斗的历史纪录——我们可以在每次僵尸攻击别人以及有一方胜出的时候产生一个事件。智能合约不需要这些数据来计算任何接下来的事情，但是这对我们在前端向用户展示来说是非常有用的东西。



###Infura

`Infura` 是一个服务，`它维护了很多以太坊节点并提供了一个缓存层来实现高速读取`。你可以用他们的 API 来免费访问这个服务。 用 Infura 作为节点提供者，你可以不用自己运营节点就能很可靠地向以太坊发送、接收信息。

你可以通过这样把 Infura 作为你的 Web3 节点提供者：

```csharp
var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws"));
```

###Metamask

Metamask `是 Chrome 和 Firefox 的浏览器扩展， 它能让用户安全地维护他们的以太坊账户和私钥`， 并用他们的账户和使用 Web3.js 的网站互动（如果你还没用过它，你肯定会想去安装的——这样你的浏览器就能使用 Web3.js 了，然后你就可以和任何与以太坊区块链通信的网站交互了）

作为开发者，如果你想让用户从他们的浏览器里通过网站和你的DApp交互（就像我们在 CryptoZombies 游戏里一样），你肯定会想要兼容 Metamask 的。

Metamask 默认使用 Infura 的服务器做为 web3 提供者。 就像我们上面做的那样。不过它还为用户提供了选择他们自己 Web3 提供者的选项。所以使用 Metamask 的 web3 提供者，你就给了用户选择权，而自己无需操心这一块。

#### 使用Metamask的web3提供者

Metamask 把它的 web3 提供者注入到浏览器的全局 JavaScript对象web3中。所以你的应用可以检查 `web3` 是否存在。若存在就使用 `web3.currentProvider` 作为它的提供者。

这里是一些 Metamask 提供的示例代码，用来检查用户是否安装了MetaMask，如果没有安装就告诉用户需要安装MetaMask来使用我们的应用。

```jsx
window.addEventListener('load', function() {

  // 检查web3是否已经注入到(Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // 使用 Mist/MetaMask 的提供者
    web3js = new Web3(web3.currentProvider);
  } else {
    // 处理用户没安装的情况， 比如显示一个消息
    // 告诉他们要安装 MetaMask 来使用我们的应用
  }

  // 现在你可以启动你的应用并自由访问 Web3.js:
  startApp()

})
```

### 获取Metamask中的用户账户

MetaMask 允许用户在扩展中管理多个账户。

我们可以通过这样来获取 web3 变量中激活的当前账户：

```csharp
var userAccount = web3.eth.accounts[0]
```

例子：监听用户是否切换账户

```jsx
var accountInterval = setInterval(function() {
  // 检查账户是否切换
  if (web3.eth.accounts[0] !== userAccount) {
    userAccount = web3.eth.accounts[0];
    // 调用一些方法来更新界面
    updateInterface();
  }
}, 100);
```

这段代码做的是，每100毫秒检查一次 userAccount 是否还等于 `web3.eth.accounts[0]` (比如：用户是否还激活了那个账户)。若不等，则将 当前激活用户赋值给 `userAccount`，然后调用一个函数来更新界面。



例子

solidity代码

```csharp
function createRandomZombie(string _name) public {
  require(ownerZombieCount[msg.sender] == 0);
  uint randDna = _generateRandomDna(_name);
  randDna = randDna - randDna % 100;
  _createZombie(_name, randDna);
}
```

这是如何在用 MetaMask 在 Web3.js 中调用这个函数的示例:

```jsx
function createRandomZombie(name) {
  // 这将需要一段时间，所以在界面中告诉用户这一点
  // 事务被发送出去了
  $("#txStatus").text("正在区块链上创建僵尸，这将需要一会儿...");
  // 把事务发送到我们的合约:
  return CryptoZombies.methods.createRandomZombie(name)
  .send({ from: userAccount })
  .on("receipt", function(receipt) {
    $("#txStatus").text("成功生成了 " + name + "!");
    // 事务被区块链接受了，重新渲染界面
    getZombiesByOwner(userAccount).then(displayZombies);
  })
  .on("error", function(error) {
    // 告诉用户合约失败了
    $("#txStatus").text(error);
  });
}
```

我们的函数 `send` 一个事务到我们的 `Web3` 提供者，然后链式添加一些事件监听:

- `receipt` 将在合约被包含进以太坊区块上以后被触发，这意味着僵尸被创建并保存进我们的合约了。
- `error` 将在事务未被成功包含进区块后触发，比如用户未支付足够的 gas。我们需要在界面中通知用户事务失败以便他们可以再次尝试。

> 注意:你可以在调用 `send` 时选择指定 `gas` 和 `gasPrice`， 例如： `.send({ from: userAccount, gas: 3000000 })`。如果你不指定，`MetaMask` 将让用户自己选择数值。

