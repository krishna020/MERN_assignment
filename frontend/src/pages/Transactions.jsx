import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { FixedSizeList as List } from 'react-window';
import { useNavigate } from 'react-router-dom';

export default function Transactions() {
  const [tx, setTx] = useState([]);
  const [page,setPage] = useState(1);
  const [meta,setMeta] = useState({});
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = useCallback(async (p=1)=> {
    setLoading(true);
    try {
      const res = await api.get(`/transactions?page=${p}&limit=50`);
      setTx(res.data.data || []);
      setMeta(res.data.meta || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=> { fetch(page); }, [fetch, page]);

  const Row = ({ index, style }) => {
    const t = tx[index];
    if (!t) return null;
    return (
      <div style={{...style, display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #eee'}}>
        <div style={{width:120}}>{new Date(t.transaction_date).toLocaleDateString()}</div>
        <div style={{width:160}}>{t.category_name}</div>
        <div style={{width:80}}>{t.type}</div>
        <div style={{width:120}}>₹ {t.amount}</div>
        <div style={{flex:1, textAlign:'right'}}><button onClick={() => navigate(`/transactions/${t.id}`)}>View</button></div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Transactions</h2>
      <div style={{marginBottom:10}}>
        <button onClick={() => navigate('/transactions/new')}>New Transaction</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <List height={500} itemCount={tx.length} itemSize={60} width={'100%'}>{Row}</List>
          <div style={{marginTop:10}}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={meta.page<=1}>Prev</button>
            <span style={{margin:'0 10px'}}>Page {meta.page || 1} / {Math.max(1, Math.ceil((meta.total||0)/(meta.limit||1)))}</span>
            <button onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
