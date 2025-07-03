
import React from 'react';
import { renderToString } from 'react-dom/server';
import BaseEmailTemplate from '@/components/email/BaseEmailTemplate';

export const renderEmailTemplate = (
  content: React.ReactNode,
  title?: string,
  preheader?: string
): string => {
  const emailElement = React.createElement(
    BaseEmailTemplate,
    { title, preheader },
    content
  );
  
  return `<!DOCTYPE html>${renderToString(emailElement)}`;
};

export const createClassifiedNotificationEmail = (classifiedData: {
  title: string;
  description: string;
  category: string;
  price?: string;
  location: string;
  contactName: string;
  phone: string;
  email: string;
}) => {
  const content = React.createElement('div', null,
    React.createElement('h2', {
      style: {
        margin: '0 0 24px 0',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827'
      }
    }, 'New Classified Ad Posted'),
    
    React.createElement('div', {
      style: {
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px'
      }
    },
      React.createElement('h3', {
        style: {
          margin: '0 0 12px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#15803d'
        }
      }, classifiedData.title),
      
      React.createElement('p', {
        style: {
          margin: '0 0 16px 0',
          fontSize: '16px',
          color: '#374151',
          lineHeight: '1.5'
        }
      }, classifiedData.description),
      
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '16px'
        }
      },
        React.createElement('div', null,
          React.createElement('strong', {
            style: { color: '#374151' }
          }, 'Category: '),
          React.createElement('span', {
            style: { color: '#6b7280' }
          }, classifiedData.category)
        ),
        
        React.createElement('div', null,
          React.createElement('strong', {
            style: { color: '#374151' }
          }, 'Location: '),
          React.createElement('span', {
            style: { color: '#6b7280' }
          }, classifiedData.location)
        ),
        
        classifiedData.price && React.createElement('div', null,
          React.createElement('strong', {
            style: { color: '#374151' }
          }, 'Price: '),
          React.createElement('span', {
            style: { color: '#16a34a', fontWeight: '600' }
          }, `$${classifiedData.price}`)
        ),
        
        React.createElement('div', null,
          React.createElement('strong', {
            style: { color: '#374151' }
          }, 'Contact: '),
          React.createElement('span', {
            style: { color: '#6b7280' }
          }, classifiedData.contactName)
        )
      )
    ),
    
    React.createElement('div', {
      style: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '24px'
      }
    },
      React.createElement('h4', {
        style: {
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151'
        }
      }, 'Contact Information'),
      
      React.createElement('p', {
        style: {
          margin: '0 0 8px 0',
          fontSize: '14px',
          color: '#6b7280'
        }
      }, `Phone: ${classifiedData.phone}`),
      
      React.createElement('p', {
        style: {
          margin: '0',
          fontSize: '14px',
          color: '#6b7280'
        }
      }, `Email: ${classifiedData.email}`)
    )
  );
  
  return renderEmailTemplate(
    content,
    `New Classified: ${classifiedData.title} - GreenYP`,
    `${classifiedData.contactName} posted a new classified ad: ${classifiedData.title}`
  );
};
