import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './app.css';


const CONTRACT_ADDRESS = "0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005"; // 智能合约地址
const CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_points",
				"type": "uint256"
			}
		],
		"name": "addChore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "ChoreAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "member",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "choreId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "ChoreSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_choreId",
				"type": "uint256"
			}
		],
		"name": "submitChore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "choreCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "chores",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllChores",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "points",
						"type": "uint256"
					}
				],
				"internalType": "struct ChoresTimeBank.Chore[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			}
		],
		"name": "getPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			}
		],
		"name": "getRecords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "choreId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct ChoresTimeBank.Record[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "records",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "choreId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalPoints",
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
]; // 智能合约ABI

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState('portal');
  const [chores, setChores] = useState([]);
  const [members, setMembers] = useState([]);
  const [badges, setBadges] = useState([
    { id: 1, name: '家务新手', points: 10, claimed: false },
    { id: 2, name: '家务达人', points: 50, claimed: false },
    { id: 3, name: '家务大师', points: 100, claimed: false },
    { id: 4, name: '家务王者', points: 200, claimed: false }
  ]);
  const [userPoints, setUserPoints] = useState(0);

  // 初始化以太坊连接
  const checkWalletIsConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        initializeContract(account);
      }
    }
  };

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        initializeContract(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const initializeContract = (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const choresContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setContract(choresContract);
    
    // 加载数据
    loadContractData(choresContract, account);
  };

  const loadContractData = async (contract, account) => {
    try {
      // 获取所有家务
      const chores = await contract.getAllChores();
      setChores(chores);
      
      // 获取用户积分
      const points = await contract.getPoints(account);
      setUserPoints(points.toNumber());
      
      // 这里可以添加获取成员列表的逻辑
      // 注意: 原合约中没有直接获取所有成员的功能，需要扩展合约或使用其他方式
    } catch (err) {
      console.error('Error loading contract data:', err);
    }
  };

  const submitChore = async (choreId) => {
    try {
      const tx = await contract.submitChore(choreId);
      await tx.wait();
      
      // 刷新数据
      const points = await contract.getPoints(currentAccount);
      setUserPoints(points.toNumber());
    } catch (err) {
      console.error('Error submitting chore:', err);
    }
  };

  const claimBadge = (badgeId) => {
    const updatedBadges = badges.map(badge => {
      if (badge.id === badgeId && userPoints >= badge.points) {
        return { ...badge, claimed: true };
      }
      return badge;
    });
    setBadges(updatedBadges);
    alert('徽章领取成功!');
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>家务时间银行</h1>
        {!currentAccount ? (
          <button onClick={connectWalletHandler} className="connect-wallet-btn">

           {/* 连接钱包 */}
          </button>
        ) : (
          <div className="wallet-info">
            <span>{`${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`}</span>
            <div className="points-display">{userPoints} 积分</div>
          </div>
        )}
      </header>
      
       {/* 第二行放标语 */}
      
        <p className="slogan">让家务变得有趣，让付出得到回报</p>
     
    
      <nav className="app-nav">
        <button 
          className={activeTab === 'portal' ? 'active' : ''} 
          onClick={() => setActiveTab('portal')}
        >
          任意门
        </button>
        <button 
          className={activeTab === 'members' ? 'active' : ''} 
          onClick={() => setActiveTab('members')}
        >
          成员
        </button>
        <button 
          className={activeTab === 'chores' ? 'active' : ''} 
          onClick={() => setActiveTab('chores')}
        >
          家务
        </button>
        <button 
          className={activeTab === 'badges' ? 'active' : ''} 
          onClick={() => setActiveTab('badges')}
        >
          徽章
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'portal' && (
          <div className="portal-section">
            <h2>欢迎来到家务时间银行</h2>
            <p>通过完成家务赚取积分，兑换精美徽章！</p>
            <div className="portal-cards">
              <div className="portal-card" onClick={() => setActiveTab('chores')}>
                <h3>家务列表</h3>
                <p>查看并完成家务任务</p>
              </div>
              <div className="portal-card" onClick={() => setActiveTab('badges')}>
                <h3>我的徽章</h3>
                <p>查看可兑换的徽章</p>
              </div>
              <div className="portal-card" onClick={() => setActiveTab('members')}>
                <h3>家庭成员</h3>
                <p>查看家庭成员积分</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-section">
            <h2>家庭成员</h2>
            <div className="members-list">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div key={index} className="member-card">
                    <div className="member-avatar">{member.name.charAt(0)}</div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.points} 积分</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>暂无成员数据</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chores' && (
          <div className="chores-section">
            <h2>家务列表</h2>
            <div className="chores-list">
              {chores.map((chore, index) => (
                <div key={index} className="chore-card">
                  <h3>{chore.name}</h3>
                  <p>积分: {chore.points}</p>
                  <button 
                    onClick={() => submitChore(index)}
                    disabled={!currentAccount}
                  >
                    完成任务
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="badges-section">
            <h2>徽章列表</h2>
            <p>当前积分: {userPoints}</p>
            <div className="badges-list">
              {badges.map(badge => (
                <div key={badge.id} className={`badge-card ${badge.claimed ? 'claimed' : ''}`}>
                  <div className="badge-icon">{badge.name.charAt(0)}</div>
                  <div className="badge-info">
                    <h3>{badge.name}</h3>
                    <p>需要 {badge.points} 积分</p>
                    {badge.claimed ? (
                      <span className="claimed-label">已领取</span>
                    ) : (
                      <button 
                        onClick={() => claimBadge(badge.id)}
                        disabled={userPoints < badge.points}
                      >
                        {userPoints >= badge.points ? '领取徽章' : '积分不足'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>家务时间银行 © 2023 - 用爱经营的家</p>
      </footer>
    </div>
  );
}

export default App;