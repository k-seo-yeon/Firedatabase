// 투두 리스트 Firebase 서비스
import { db } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';

// 사용자별 투두 컬렉션 참조 생성 함수
const getUserTodosCol = (userId) => collection(db, 'users', userId, 'todos');

// 사용자의 모든 투두 조회
export const getUserTodos = async (userId) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const q = query(
      userTodosCol,
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user todos:', error);
    return [];
  }
};

// 특정 날짜의 투두 조회
export const getTodosByDate = async (userId, dateKey) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const q = query(
      userTodosCol,
      where('date', '==', dateKey),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting todos by date:', error);
    return [];
  }
};

// 새 투두 생성
export const createTodo = async (userId, todoData) => {
  try {
    console.log('Creating todo for user:', userId, 'data:', todoData);
    const userTodosCol = getUserTodosCol(userId);
    const todo = {
      text: todoData.text,
      progress: todoData.progress || 0,
      date: todoData.date,
      completed: todoData.completed || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(userTodosCol, todo);
    console.log('Todo created with ID:', docRef.id);
    
    // 생성된 투두 객체 반환 (타임스탬프는 현재 시간으로 설정)
    return { 
      id: docRef.id, 
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// 투두 수정
export const updateTodo = async (userId, todoId, updates) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const todoRef = doc(userTodosCol, todoId);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// 투두 삭제
export const deleteTodo = async (userId, todoId) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const todoRef = doc(userTodosCol, todoId);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// 투두 진행률 업데이트
export const updateTodoProgress = async (userId, todoId, progress) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const todoRef = doc(userTodosCol, todoId);
    await updateDoc(todoRef, {
      progress,
      completed: progress === 100,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating todo progress:', error);
    throw error;
  }
};

// 사용자 투두 실시간 구독
export const subscribeUserTodos = (userId, callback) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const q = query(
      userTodosCol,
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(todos);
    }, (error) => {
      console.error('Error subscribing to user todos:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up todo subscription:', error);
    return () => {};
  }
};

// 특정 날짜 투두 실시간 구독
export const subscribeTodosByDate = (userId, dateKey, callback) => {
  try {
    console.log('Setting up subscription for user:', userId, 'date:', dateKey);
    const userTodosCol = getUserTodosCol(userId);
    const q = query(
      userTodosCol,
      where('date', '==', dateKey),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      console.log('Snapshot received for date:', dateKey, 'docs:', querySnapshot.docs.length);
      const todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(todos);
    }, (error) => {
      console.error('Error subscribing to todos by date:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up date todo subscription:', error);
    return () => {};
  }
};

// 투두 완료 토글
export const toggleTodoComplete = async (userId, todoId, completed) => {
  try {
    const userTodosCol = getUserTodosCol(userId);
    const todoRef = doc(userTodosCol, todoId);
    await updateDoc(todoRef, {
      completed,
      progress: completed ? 100 : 0,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling todo complete:', error);
    throw error;
  }
};
