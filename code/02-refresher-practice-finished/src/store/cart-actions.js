import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

export const onfetchCartData = () => {
  return async dispatch => {
    const fetchData = async () => {
      const response = await fetch('https://react-http-2-f4a57-default-rtdb.firebaseio.com/cart.json');
      if (!response.ok) {
        throw new Error('Could not fetch cart data');
      }
      const data = await response.json();
      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart({ items: cartData.items || [], totalQuantity: cartData.totalQuantity }));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Fetching cart data failed :/',
        })
      );
    }
  };
};

export const sendCartData = cart => {
  return async dispatch => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending',
        message: 'Sending Cart Data',
      })
    );

    const sendRequest = async () => {
      const response = await fetch('https://react-http-2-f4a57-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
      });
      if (!response.ok) {
        throw new Error('Sending cart data failed');
      }
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'success',
          message: 'Sent cart data successfully',
        })
      );
    };

    await sendRequest().catch(error => {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sent cart data failed :/',
        })
      );
    });
  };
};
