import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import BoardListView from '../views/BoardListView.vue';
import BoardCreateView from '../views/BoardCreateView.vue';
import BoardDetailView from '../views/BoardDetailView.vue';
import ChatView from '../views/ChatView.vue';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainView,
  },
  {
    path: '/board',
    name: 'BoardList',
    component: BoardListView,
  },
  {
    path: '/create',
    name: 'BoardCreate',
    component: BoardCreateView,
  },
  {
    // 동적 라우트 매칭: :board_id 부분에 어떤 값이든 올 수 있습니다.
    path: '/board/:board_id',
    name: 'BoardDetail',
    component: BoardDetailView,
    props: true, // route.params를 컴포넌트의 props로 전달합니다.
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;