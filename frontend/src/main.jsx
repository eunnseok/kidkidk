import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './router/App.jsx';
import './index.css';
import { RecoilRoot, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import RecoilizeDebugger from 'recoilize';

// const { persistAtom } = new RecoilPersist();

// // 페이지 이동 방지
// window.history.pushState(null, null, window.location.href);
// window.onpopstate = function (event) {
//     window.history.pushState(null, null, window.location.href);
// };

// // 뒤로/앞으로 버튼 클릭 시 페이지 이동
// window.addEventListener('popstate', function (event) {
//     // 이동하고자 하는 URL이 있다면 해당 URL로 이동할 수 있습니다.
//     // 예시: window.location.href = '새로운 URL';
//     console.log('뒤로/앞으로 버튼 클릭으로 이동합니다.');
// });

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
    <RecoilRoot>
        <RecoilizeDebugger />
        <App />
    </RecoilRoot>
);

// Recoil 상태 변화 감지 및 로컬 스토리지에 저장
// useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
//     updateState(snapshot);
// });
