import { put } from 'redux-saga/effects';
import { setValue } from './reducer';

export default function* changeValueSaga(action) {
  yield put(setValue(action.payload));
}
