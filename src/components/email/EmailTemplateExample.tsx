
import React from 'react';
import BaseEmailTemplate from './BaseEmailTemplate';

const EmailTemplateExample = () => {
  return (
    <BaseEmailTemplate 
      title="GreenYP Classified Notification"
      preheader="New classified ad posted on GreenYP"
    >
      <div>
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827'
          }}
        >
          New Classified Ad Posted
        </h2>
        
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#15803d'
            }}
          >
            John Deere Riding Mower - Excellent Condition
          </h3>
          
          <p
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              color: '#374151',
              lineHeight: '1.5'
            }}
          >
            Well-maintained John Deere riding mower with 42" cutting deck. 
            Recently serviced with new blades and oil change. Perfect for medium to large yards.
          </p>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '16px'
            }}
          >
            <div>
              <strong style={{ color: '#374151' }}>Category: </strong>
              <span style={{ color: '#6b7280' }}>Lawn Equipment</span>
            </div>
            
            <div>
              <strong style={{ color: '#374151' }}>Location: </strong>
              <span style={{ color: '#6b7280' }}>Austin, TX</span>
            </div>
            
            <div>
              <strong style={{ color: '#374151' }}>Price: </strong>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>$2,500</span>
            </div>
            
            <div>
              <strong style={{ color: '#374151' }}>Contact: </strong>
              <span style={{ color: '#6b7280' }}>Mike Johnson</span>
            </div>
          </div>
        </div>
        
        <div
          style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '24px'
          }}
        >
          <h4
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}
          >
            Contact Information
          </h4>
          
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            Phone: (555) 123-4567
          </p>
          
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            Email: mike.johnson@example.com
          </p>
        </div>
      </div>
    </BaseEmailTemplate>
  );
};

export default EmailTemplateExample;
