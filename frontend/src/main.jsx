import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { applyMediaCssVariables } from './lib/media';
import './styles.css';
import './styles/intro.css';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UET Navigator render error:', error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <main className="runtime-error">
      <p className="eyebrow">LỖI HIỂN THỊ</p>
      <h1>Không thể hiển thị trang này.</h1>
      <p>{this.state.error.message || 'Đã xảy ra lỗi không xác định trong giao diện React.'}</p>
      <button className="primary" onClick={() => location.reload()}>Tải lại trang</button>
    </main>;
  }
}

const rootElement = document.getElementById('root');
rootElement.dataset.mounted = 'true';
applyMediaCssVariables();

createRoot(rootElement).render(
  <StrictMode><AppErrorBoundary><App /></AppErrorBoundary></StrictMode>
);
