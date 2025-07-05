# 家务时间银行 (ChoresTimeBank)

一个基于以太坊区块链的家务管理系统，让家庭成员通过完成家务赚取积分，兑换精美徽章。

## 新功能更新

### 🆕 新增功能

#### 1. 添加家务功能
- **权限控制**: 只有合约所有者可以添加新的家务任务
- **表单界面**: 提供友好的表单界面来添加家务名称和积分奖励
- **实时更新**: 添加后立即刷新家务列表

#### 2. 昵称设置功能
- **个性化**: 用户可以设置个人昵称
- **显示优化**: 昵称显示在钱包地址旁边，便于识别
- **模态框界面**: 使用模态框提供良好的用户体验

### 🔧 技术实现

#### 智能合约更新 (`contracts/ChoresTimeBank.sol`)
```solidity
// 新增昵称映射
mapping(address => string) public nicknames;

// 新增事件
event NicknameSet(address member, string nickname);

// 新增函数
function setNickname(string memory _nickname) public {
    nicknames[msg.sender] = _nickname;
    emit NicknameSet(msg.sender, _nickname);
}

function getNickname(address _member) public view returns (string memory) {
    return nicknames[_member];
}
```

#### 前端更新 (`src/app.js`)
- 更新合约ABI以包含新函数
- 添加昵称相关的状态管理
- 实现添加家务的表单界面
- 实现昵称设置的模态框
- 添加所有者权限检查

#### 样式更新 (`src/app.css`)
- 新增用户信息显示样式
- 新增表单和模态框样式
- 优化按钮和交互效果

## 🚀 使用方法

### 添加家务
1. 确保你的钱包地址是合约的所有者
2. 在"家务"页面点击"添加家务"按钮
3. 填写家务名称和积分奖励
4. 点击"添加"按钮确认

### 设置昵称
1. 连接钱包后，在右上角点击"设置昵称"按钮
2. 在弹出的模态框中输入你的昵称
3. 点击"设置"按钮确认
4. 昵称会显示在钱包地址旁边

## 📋 功能列表

### 核心功能
- ✅ 连接MetaMask钱包
- ✅ 查看家务列表
- ✅ 完成家务任务赚取积分
- ✅ 查看个人积分
- ✅ 兑换徽章系统
- ✅ **新增**: 添加家务任务（仅所有者）
- ✅ **新增**: 设置个人昵称

### 界面特性
- 🎨 现代化渐变背景
- 📱 响应式设计
- ✨ 流畅的动画效果
- 🎯 直观的用户界面

## 🛠️ 技术栈

- **前端**: React.js
- **区块链**: Ethereum
- **钱包**: MetaMask
- **合约**: Solidity
- **样式**: CSS3 with Glassmorphism

## 📁 项目结构

```
ChoresTimeBank/
├── contracts/
│   └── ChoresTimeBank.sol      # 智能合约
├── src/
│   ├── app.js                  # 主应用组件
│   ├── app.css                 # 样式文件
│   ├── index.js                # 入口文件
│   └── index.css               # 全局样式
├── Frontend/
│   └── test.html               # 功能测试页面
├── public/
│   └── index.html              # HTML模板
├── package.json                # 项目依赖
└── README.md                   # 项目说明
```

## 🔐 权限说明

- **合约所有者**: 可以添加新的家务任务
- **普通用户**: 可以完成任务、设置昵称、查看积分

## 💡 注意事项

1. **Gas费用**: 添加家务和设置昵称都需要支付Gas费用
2. **权限控制**: 只有合约部署者才能添加家务
3. **数据持久化**: 所有数据都存储在区块链上
4. **网络要求**: 需要连接到以太坊网络（主网或测试网）

## 🎯 未来计划

- [ ] 添加家庭成员管理功能
- [ ] 实现积分转账功能
- [ ] 添加家务完成历史记录
- [ ] 实现更丰富的徽章系统
- [ ] 添加数据统计和分析功能

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目地址: [GitHub Repository]
- 邮箱: [your-email@example.com]

---

**家务时间银行** - 让家务变得有趣，让付出得到回报！ 🏠✨ 