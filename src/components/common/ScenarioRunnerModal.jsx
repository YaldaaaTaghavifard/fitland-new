import { useState } from "react";
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { scenariosList } from "../../services/scenarioService";
import { dataService } from "../../services/dataService";

export default function ScenarioRunnerModal({ isOpen, onClose }) {
  const [results, setResults] = useState({});
  const [runningId, setRunningId] = useState(null);
  const [expandedId, setExpandedId] = useState("SCN-01");
  const [isRunningAll, setIsRunningAll] = useState(false);

  if (!isOpen) return null;

  const runSingle = async (scenario) => {
    setRunningId(scenario.id);
    try {
      const res = await scenario.run();
      setResults((prev) => ({
        ...prev,
        [scenario.id]: { passed: true, details: res.details, timestamp: new Date().toLocaleTimeString() },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [scenario.id]: { passed: false, error: err.message, timestamp: new Date().toLocaleTimeString() },
      }));
    } finally {
      setRunningId(null);
    }
  };

  const runAll = async () => {
    setIsRunningAll(true);
    for (const scn of scenariosList) {
      await runSingle(scn);
    }
    setIsRunningAll(false);
  };

  const handleResetData = () => {
    dataService.resetDemoData();
    setResults({});
  };

  const passedCount = Object.values(results).filter((r) => r.passed).length;

  return (
    <div className="scenario-modal-backdrop">
      <div className="scenario-modal-panel">
        <div className="scenario-modal-header">
          <div>
            <div className="scenario-badge-title">
              <Sparkles size={18} className="text-primary" />
              <h3>موتور ارزیابی سناریوهای عملیاتی فیت‌لند</h3>
            </div>
            <p className="scenario-sub">
              اجرای زنده تست‌های کاربردی به شیوه Given / When / Then مطابق الزامات ارزیابی دانشگاهی
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="scenario-toolbar">
          <div className="scenario-counter">
            <span>تست‌های پاس‌شده:</span>
            <strong className="text-emerald-500 font-mono">
              {passedCount} / {scenariosList.length}
            </strong>
          </div>

          <div className="scenario-actions">
            <button
              type="button"
              className="chic-btn chic-btn-ghost btn-sm"
              onClick={handleResetData}
            >
              <RotateCcw size={14} />
              <span>بازنشانی دیتابیس دمو</span>
            </button>

            <button
              type="button"
              className="chic-btn chic-btn-primary btn-sm"
              disabled={isRunningAll}
              onClick={runAll}
            >
              <Play size={14} />
              <span>{isRunningAll ? "در حال اجرای کلیه تست‌ها..." : "اجرای همه سناریوها"}</span>
            </button>
          </div>
        </div>

        <div className="scenarios-scroll-list">
          {scenariosList.map((scn) => {
            const res = results[scn.id];
            const isRunning = runningId === scn.id;
            const isExpanded = expandedId === scn.id;

            return (
              <div
                key={scn.id}
                className={`scenario-card ${res?.passed ? "passed" : res?.passed === false ? "failed" : ""}`}
              >
                <div
                  className="scenario-card-header"
                  onClick={() => setExpandedId(isExpanded ? null : scn.id)}
                >
                  <div className="header-meta">
                    <span className="scn-id">{scn.id}</span>
                    <strong className="scn-title">{scn.title}</strong>
                    <span className="scn-cat">{scn.category}</span>
                  </div>

                  <div className="header-status-box">
                    {isRunning ? (
                      <span className="status-indicator running">
                        <Clock size={15} className="animate-spin" />
                        در حال اجرا...
                      </span>
                    ) : res?.passed ? (
                      <span className="status-indicator success">
                        <CheckCircle2 size={16} />
                        پاس شد ✓
                      </span>
                    ) : res?.passed === false ? (
                      <span className="status-indicator fail">
                        <XCircle size={16} />
                        رد شد
                      </span>
                    ) : (
                      <span className="status-indicator idle">آماده اجرا</span>
                    )}

                    <button
                      type="button"
                      className="run-btn"
                      disabled={isRunning}
                      onClick={(e) => {
                        e.stopPropagation();
                        runSingle(scn);
                      }}
                    >
                      <Play size={13} />
                      تست
                    </button>

                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="scenario-card-body">
                    <div className="gwt-grid">
                      <div className="gwt-col">
                        <span className="gwt-label">Given (فرض اولیه):</span>
                        <p>{scn.given}</p>
                      </div>
                      <div className="gwt-col">
                        <span className="gwt-label">When (اقدام کاربر/سیستم):</span>
                        <p>{scn.when}</p>
                      </div>
                      <div className="gwt-col">
                        <span className="gwt-label">Then (خروجی و انتظار):</span>
                        <p>{scn.then}</p>
                      </div>
                    </div>

                    {res && (
                      <div className={`execution-result-box ${res.passed ? "res-ok" : "res-err"}`}>
                        <strong>خروجی اجرای زنده:</strong>
                        <p>{res.passed ? res.details : res.error}</p>
                        <small className="exec-time">زمان اجرا: {res.timestamp}</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
