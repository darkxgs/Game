// Sidebar Component - Direct port from Sidebar.svelte
import { useState, useRef, useEffect, useCallback } from 'react';
import { ROW_COUNT_OPTIONS, AUTO_BET_INTERVAL_MS, getBinColors } from './constants';
import { CurrencyIcon, CURRENCY_NAME } from '../../config/currency';
import './Sidebar.css';
import { Tooltip, Tag, InputNumber, Button, Typography } from 'antd';
import { TrophyOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

function Sidebar({
    balance,
    betAmount,
    setBetAmount,
    rowCount,
    setRowCount,
    riskLevel,
    setRiskLevel,
    hasOutstandingBalls,
    onDropBall,
    onSettingsClick,
    onStatsClick,
    isSettingsOpen,
    isStatsOpen,
    // Plinko-specific props
    selectedBallType,
    setSelectedBallType,
    ballTypes,
    currentBall,
    lastWin,
    winRecords,
    currentStreak,
    maxStreak,
}) {
    const [betMode, setBetMode] = useState('manual'); // 'manual' | 'auto'
    const [autoBetInput, setAutoBetInput] = useState(0);
    const [autoBetsLeft, setAutoBetsLeft] = useState(null);
    const [isAutoBetting, setIsAutoBetting] = useState(false);
    const [isBallSelectorExpanded, setIsBallSelectorExpanded] = useState(false);
    const autoBetIntervalRef = useRef(null);

    // Validation
    const isBetAmountNegative = betAmount < 0;
    const isBetExceedBalance = betAmount > balance;
    const isAutoBetInputNegative = autoBetInput < 0;
    const isDropBallDisabled = isBetAmountNegative || isBetExceedBalance || isAutoBetInputNegative;
    const savedAutoBet = useRef();

    // Keep the latest auto bet logic in a ref
    useEffect(() => {
        savedAutoBet.current = () => {
            if (betAmount > balance) {
                setIsAutoBetting(false);
                return;
            }

            // Infinite mode
            if (autoBetsLeft === null) {
                onDropBall?.();
                return;
            }

            // Finite mode
            if (autoBetsLeft > 0) {
                onDropBall?.();
                setAutoBetsLeft(prev => prev - 1);
            }
        };
    }, [betAmount, balance, autoBetsLeft, onDropBall]);

    // Check if finite auto bets reached 0
    useEffect(() => {
        if (autoBetsLeft === 0) {
            setIsAutoBetting(false);
        }
    }, [autoBetsLeft]);

    // Start/stop auto bet interval efficiently (never restarts on state changes)
    useEffect(() => {
        if (isAutoBetting) {
            const id = setInterval(() => savedAutoBet.current(), AUTO_BET_INTERVAL_MS);
            return () => clearInterval(id);
        }
    }, [isAutoBetting]);

    const handleBetClick = () => {
        if (betMode === 'manual') {
            onDropBall?.();
        } else if (!isAutoBetting) {
            // Start auto bet
            setAutoBetsLeft(autoBetInput === 0 ? null : autoBetInput);
            setIsAutoBetting(true);
        } else {
            // Stop auto bet
            setIsAutoBetting(false);
            setAutoBetsLeft(null);
        }
    };

    const handleBetAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        setBetAmount(isNaN(value) ? 0 : value);
    };

    const handleAutoBetInputChange = (e) => {
        const value = parseInt(e.target.value);
        setAutoBetInput(isNaN(value) ? 0 : value);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => setIsAutoBetting(false);
    }, []);

    const riskLevels = [
        { value: 'low', label: 'منخفض' },
        { value: 'medium', label: 'متوسط' },
        { value: 'high', label: 'عالي' },
    ];

    return (
        <div className="sidebar">
            {/* Bet Mode Tabs */}
            <div className="bet-mode-tabs">
                <button
                    className={`bet-mode-tab ${betMode === 'manual' ? 'active' : ''}`}
                    onClick={() => setBetMode('manual')}
                    disabled={isAutoBetting}
                >
                    يدوي
                </button>
                <button
                    className={`bet-mode-tab ${betMode === 'auto' ? 'active' : ''}`}
                    onClick={() => setBetMode('auto')}
                    disabled={isAutoBetting}
                >
                    تلقائي
                </button>
            </div>

            {/* Bet Button (Moved to top) */}
            <button
                className={`bet-button ${isAutoBetting ? 'stop' : ''}`}
                onClick={handleBetClick}
                disabled={isDropBallDisabled}
                style={{ marginBottom: '16px' }}
            >
                {betMode === 'manual' ? 'إسقاط الكرة' : isAutoBetting ? 'إيقاف الرهان التلقائي' : 'بدء الرهان التلقائي'}
            </button>

            {/* Bet Amount */}
            <div className="form-group">
                <div className="form-header">
                    <label htmlFor="betAmount" className="form-label" style={{ margin: 0 }}>مبلغ الرهان</label>
                    <Text type="secondary" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CurrencyIcon size={14} />
                        {(betAmount ?? 0).toFixed(2)}
                    </Text>
                </div>
                <div className="input-row">
                    <InputNumber
                        id="betAmount"
                        value={betAmount}
                        onChange={(val) => setBetAmount(isNaN(Number(val)) ? 0 : Number(val))}
                        min={0}
                        step={0.01}
                        disabled={isAutoBetting}
                        style={{ flex: 1 }}
                        controls={false}
                        formatter={(v) => `${v}`}
                        parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
                        addonBefore={<div className="btc-icon" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><CurrencyIcon size={16} /></div>}
                    />
                    <Button.Group>
                        <Button
                            onClick={() => setBetAmount(prev => parseFloat((Number(prev || 0) / 2).toFixed(2)))}
                            disabled={isAutoBetting}
                        >
                            ½
                        </Button>
                        <Button
                            onClick={() => setBetAmount(prev => parseFloat((Number(prev || 0) * 2).toFixed(2)))}
                            disabled={isAutoBetting}
                        >
                            2×
                        </Button>
                    </Button.Group>
                </div>
                {isBetAmountNegative && (
                    <p className="error-text">يجب أن يكون أكبر من أو يساوي 0.</p>
                )}
                {isBetExceedBalance && (
                    <p className="error-text">لا يمكنك الرهان بأكثر من رصيدك!</p>
                )}
            </div>

            {/* Risk Level */}
            <div className="form-group">
                <label htmlFor="riskLevel" className="form-label">المخاطرة</label>
                <select
                    id="riskLevel"
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    disabled={hasOutstandingBalls || isAutoBetting}
                    className="form-select"
                >
                    {riskLevels.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Row Count */}
            <div className="form-group">
                <label htmlFor="rowCount" className="form-label">الصفوف</label>
                <select
                    id="rowCount"
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value))}
                    disabled={hasOutstandingBalls || isAutoBetting}
                    className="form-select"
                >
                    {ROW_COUNT_OPTIONS.map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Auto Bet Input */}
            {betMode === 'auto' && (
                <div className="form-group">
                    <div className="form-label-row">
                        <label htmlFor="autoBetInput" className="form-label">عدد الرهانات</label>
                        <span className="help-icon" title="أدخل '0' للرهانات غير المحدودة.">?</span>
                    </div>
                    <div className="auto-bet-input">
                        <input
                            id="autoBetInput"
                            type="number"
                            value={isAutoBetting ? (autoBetsLeft ?? 0) : autoBetInput}
                            onChange={handleAutoBetInputChange}
                            disabled={isAutoBetting}
                            min="0"
                            inputMode="numeric"
                            className={isAutoBetInputNegative ? 'error' : ''}
                        />
                        {autoBetInput === 0 && !isAutoBetting && (
                            <span className="infinity-icon">∞</span>
                        )}
                    </div>
                    {isAutoBetInputNegative && (
                        <p className="error-text">يجب أن يكون أكبر من أو يساوي 0.</p>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="footer-buttons">
                    <button
                        className={`footer-btn ${isStatsOpen ? 'active' : ''}`}
                        onClick={onStatsClick}
                        title="الإحصائيات المباشرة"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 11.78l4.24-7.33 1.73 1-5.23 9.05-6.51-3.75L5.46 19H22v2H2V3h2v14.54L9.5 8z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* --- Plinko extra: Ball Selector, Last Win, Streak --- */}
            <div className="ball-selector-card sidebar-card">
                <div 
                    className="ball-selector-header" 
                    onClick={() => setIsBallSelectorExpanded(!isBallSelectorExpanded)}
                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <StarOutlined />
                        <span>نوع الكرة</span>
                        {!isBallSelectorExpanded && selectedBallType && (
                            <span style={{ fontSize: '12px', background: '#2a3f4d', padding: '2px 8px', borderRadius: '10px', color: '#10b981' }}>
                                {ballTypes[selectedBallType]?.name}
                            </span>
                        )}
                    </div>
                    <span>{isBallSelectorExpanded ? '▲' : '▼'}</span>
                </div>
                {isBallSelectorExpanded && (
                <div className="ball-types-grid">
                    {Object.values(ballTypes || {}).map(ball => (
                        <Tooltip
                            key={ball.id}
                            title={
                                <div>
                                    <div style={{ fontWeight: 600 }}>{ball.name}</div>
                                    <div>{ball.description}</div>
                                    <div style={{ color: 'var(--text-secondary)' }}>التكلفة: {ball.cost}× الرهان</div>
                                </div>
                            }
                        >
                            <div
                                className={`ball-type-option ${selectedBallType === ball.id ? 'selected' : ''}`}
                                onClick={() => setSelectedBallType?.(ball.id)}
                                style={{ '--ball-color': ball.color }}
                            >
                                <div
                                    className="ball-color-circle"
                                    style={{ backgroundImage: `url(${ball.image})`, backgroundSize: 'cover', backgroundColor: 'transparent' }}
                                ></div>
                                <div className="ball-type-content">
                                    <div className="ball-type-name">{ball.name}</div>
                                    <div className="ball-type-cost">{ball.cost}×</div>
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                </div>
                )}
            </div>

            {/* Last Win card removed as requested */}

            {/* Streak UI moved to History & Statistics */}
        </div>
    );
}

export default Sidebar;
