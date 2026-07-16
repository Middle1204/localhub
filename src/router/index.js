import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/Main.vue';
import BoardListView from '../views/BoardListView.vue';
import BoardCreateView from '../views/BoardCreateView.vue';
import BoardDetailView from '../views/BoardDetailView.vue';
import ChatView from '../views/ChatView.vue';
import SearchResults from '../views/SearchResults.vue';

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
  {
    path: '/search',
    name: 'Search',
    component: SearchResults,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 저장된 위치가 있으면 (브라우저 뒤로가기) 그 위치로 이동
    if (savedPosition) {
      return savedPosition;
    } else {
      // 그렇지 않으면 페이지 맨 위로 스크롤 (즉시 이동)
      return { top: 0, left: 0 };
    }
  },
});

export default router;