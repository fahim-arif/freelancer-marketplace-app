import ProgressDialog from 'components/common/ProgressDialog';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useProgressBar = (): [JSX.Element, (show?: boolean) => void, (url: string, showMessage?: boolean) => void] => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  return [
    loading ? (
      <ProgressDialog showLoading={loading} showSuccess={success} />
    ) : success ? (
      <ProgressDialog showLoading={loading} showSuccess={success} />
    ) : (
      <React.Fragment></React.Fragment>
    ),
    (show = true) => {
      setLoading(show);
    },
    (url: string, showMessage = true) => {
      setTimeout(() => {
        // Show for at least 200 ms
        setLoading(false);
        if (showMessage) {
          // Show success for at least 500 ms
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            navigate(url);
          }, 800);
        } else {
          navigate(url);
        }
      }, 500);
    },
  ];
};

export default useProgressBar;
