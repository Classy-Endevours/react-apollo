import { takeLatest } from 'redux-saga/effects';
import { changeValue } from '../../components/HelloWorld/reducer';
import changeValueSaga from '../../components/HelloWorld/saga';

export default function* watcherSagas() {
  yield takeLatest(changeValue.type, changeValueSaga);
}
