import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ListPage = () => {
  const navigate = useNavigate();
  const { listName } = useParams();
  const location = useLocation();
  const { listItems, isListSaved } = location.state || {};

  useEffect(() => {
    if (!listItems || !isListSaved) {
      navigate('/');
    }
  }, [listItems, isListSaved, navigate]);

  return (
    <div>
      <h2>List Name: {listName}</h2>
      {listItems && listItems.length > 0 ? (
        <ul>
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No items in the list</p>
      )}
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
};

export default ListPage;

