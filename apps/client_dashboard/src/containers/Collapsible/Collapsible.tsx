import { useState } from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import styles from './Collapsible.module.css';

export default function Collapsible(props: { children: React.ReactNode; header: React.ReactNode }) {
  const { children, header } = props;
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <IoChevronDownSharp
          size={'1rem'}
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            marginRight: '0.5rem'
          }}
        />
        {header}
      </div>
      <div className={styles.content} style={{ display: collapsed ? 'none' : 'block' }}>
        {children}
      </div>
    </div>
  );
}
