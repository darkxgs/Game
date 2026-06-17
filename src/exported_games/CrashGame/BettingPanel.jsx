import { useState, useEffect } from 'react';
import { Switch, Typography } from 'antd';
import { SyncOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import './BettingPanel.css'; // We'll create this to store the specific styles

const { Text } = Typography;

function BettingPanel({ phase, betPlaced, multiplier, onBet, onCashout, panelId }) {
    const [betAmount, setBetAmount] = useState(0.05);
    const [autoCashout, setAutoCashout] = useState(false);
    const [autoCashoutMultiplier, setAutoCashoutMultiplier] = useState(2.00);
    const [autoBet, setAutoBet] = useState(false);

    // Auto Cashout Logic
    useEffect(() => {
        if (phase === 'running' && betPlaced && autoCashout) {
            if (multiplier >= autoCashoutMultiplier) {
                onCashout();
            }
        }
    }, [multiplier, phase, betPlaced, autoCashout, autoCashoutMultiplier, onCashout]);

    // Auto Bet Logic
    useEffect(() => {
        let timer;
        if (autoBet && phase === 'waiting' && !betPlaced) {
            // Place bet after a short delay when phase becomes waiting
            timer = setTimeout(() => {
                if (autoBet && phase === 'waiting' && !betPlaced) {
                    onBet(betAmount);
                }
            }, 500);
        }
        return () => clearTimeout(timer);
    }, [phase, autoBet, betPlaced, betAmount, onBet]);

    const handleBetClick = () => {
        if (phase === 'waiting' && !betPlaced) {
            onBet(betAmount);
        } else if (phase === 'running' && betPlaced) {
            onCashout();
        }
    };

    const getButtonText = () => {
        if (phase === 'waiting') {
            return betPlaced ? 'CANCEL BET' : 'BET FOR NEXT ROUND';
        }
        if (phase === 'running' && betPlaced) {
            return `CASH OUT x${multiplier.toFixed(2)}`;
        }
        return 'BET FOR NEXT ROUND';
    };

    return (
        <div className="clone-betting-panel">
            <div className="clone-betting-controls">
                {/* Number Input Row */}
                <div className="clone-input-row">
                    <button className="clone-icon-btn" onClick={() => setBetAmount(Math.max(0.01, (Number(betAmount) || 0) - 0.05))}><MinusOutlined /></button>
                    <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value === '' ? '' : Number(e.target.value))} className="clone-amount-input" />
                    <button className="clone-icon-btn" onClick={() => setBetAmount((Number(betAmount) || 0) + 0.05)}><PlusOutlined /></button>
                </div>

                {/* Preset Buttons Grid */}
                <div className="clone-preset-grid">
                    <button className="clone-preset-btn" onClick={() => setBetAmount(1)}>1</button>
                    <button className="clone-preset-btn" onClick={() => setBetAmount(10)}>10</button>
                    <button className="clone-preset-btn" onClick={() => setBetAmount(25)}>25</button>
                    <button className="clone-preset-btn" onClick={() => setBetAmount(50)}>50</button>
                </div>

                {/* Auto Cashout Toggle */}
                <div className="clone-auto-cashout" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch size="small" checked={autoCashout} onChange={setAutoCashout} />
                    <Text style={{ color: '#fff', fontSize: 12 }}>Auto Cashout</Text>
                    {autoCashout && (
                        <div style={{ display: 'flex', alignItems: 'center', background: '#0a0b10', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
                            <input 
                                type="number" 
                                step="0.01"
                                min="1.01"
                                value={autoCashoutMultiplier} 
                                onChange={(e) => setAutoCashoutMultiplier(e.target.value === '' ? '' : Number(e.target.value))}
                                style={{ width: '60px', background: 'transparent', border: 'none', color: '#fff', padding: '4px 6px', fontSize: '12px', outline: 'none' }}
                            />
                            <span style={{ padding: '0 6px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>x</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="clone-betting-action">
                {/* Main Action Button */}
                <button 
                    className={`clone-main-btn ${phase === 'running' && betPlaced ? 'cashout' : ''}`}
                    onClick={handleBetClick}
                >
                    <div className="btn-text">{getButtonText()}</div>
                    {!betPlaced && phase === 'waiting' && (
                        <div className="btn-amount">{betAmount.toFixed(2)}</div>
                    )}
                </button>

                {/* Auto Bet */}
                <button 
                    className={`clone-auto-bet-btn ${autoBet ? 'active' : ''}`} 
                    onClick={() => setAutoBet(!autoBet)}
                    style={autoBet ? { background: '#222', color: '#10b981', borderColor: '#10b981' } : {}}
                >
                    Auto Bet <SyncOutlined spin={autoBet} style={{ fontSize: 10, marginLeft: 4 }} />
                </button>
            </div>
        </div>
    );
}

export default BettingPanel;
