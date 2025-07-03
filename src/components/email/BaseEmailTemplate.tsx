
import React from 'react';

interface BaseEmailTemplateProps {
  children: React.ReactNode;
  title?: string;
  preheader?: string;
}

const BaseEmailTemplate = ({ children, title = "GreenYP", preheader }: BaseEmailTemplateProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {preheader && (
          <div
            style={{
              display: 'none',
              fontSize: '1px',
              color: '#fefefe',
              lineHeight: '1px',
              fontFamily: 'Arial, sans-serif',
              maxHeight: '0px',
              maxWidth: '0px',
              opacity: 0,
              overflow: 'hidden'
            }}
          >
            {preheader}
          </div>
        )}
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#f9fafb',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        {/* Email Container */}
        <table
          role="presentation"
          style={{
            width: '100%',
            backgroundColor: '#f9fafb',
            margin: 0,
            padding: '40px 0'
          }}
        >
          <tr>
            <td align="center">
              {/* Main Content Container */}
              <table
                role="presentation"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '32px 40px 24px 40px',
                      borderBottom: '1px solid #e5e7eb'
                    }}
                  >
                    <table role="presentation" style={{ width: '100%' }}>
                      <tr>
                        <td align="left">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Logo/Leaf Icon */}
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ marginRight: '12px' }}
                            >
                              <path
                                d="M11 2L13.3 8.2C14.1 10.5 15.8 12.3 18 13.2L22 14.5C22.8 14.8 22.8 15.9 22 16.2L18 17.5C15.8 18.4 14.1 20.2 13.3 22.5L11 28.7C10.7 29.4 9.3 29.4 9 28.7L6.7 22.5C5.9 20.2 4.2 18.4 2 17.5L-2 16.2C-2.8 15.9 -2.8 14.8 -2 14.5L2 13.2C4.2 12.3 5.9 10.5 6.7 8.2L9 2C9.3 1.3 10.7 1.3 11 2Z"
                                fill="#16a34a"
                              />
                            </svg>
                            <h1
                              style={{
                                margin: 0,
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#15803d',
                                lineHeight: '1.2'
                              }}
                            >
                              GreenYP
                            </h1>
                          </div>
                          <p
                            style={{
                              margin: '8px 0 0 0',
                              fontSize: '14px',
                              color: '#6b7280',
                              lineHeight: '1.4'
                            }}
                          >
                            Buy and sell lawn, garden, and agricultural equipment and services.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Main Content */}
                <tr>
                  <td style={{ padding: '40px' }}>
                    {children}
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#f9fafb',
                      padding: '32px 40px',
                      borderTop: '1px solid #e5e7eb'
                    }}
                  >
                    <table role="presentation" style={{ width: '100%' }}>
                      <tr>
                        <td align="center">
                          <p
                            style={{
                              margin: '0 0 16px 0',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#374151'
                            }}
                          >
                            GreenYP - Classifieds
                          </p>
                          <p
                            style={{
                              margin: '0 0 24px 0',
                              fontSize: '14px',
                              color: '#6b7280',
                              lineHeight: '1.5'
                            }}
                          >
                            Your marketplace for lawn, garden, and agricultural equipment and services.
                          </p>
                          
                          {/* Action Button */}
                          <div style={{ marginBottom: '24px' }}>
                            <a
                              href="https://greenyp.com/classifieds"
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#16a34a',
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: '600',
                                textDecoration: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                border: 'none'
                              }}
                            >
                              Visit GreenYP Classifieds
                            </a>
                          </div>

                          {/* Social/Contact Links */}
                          <div style={{ marginBottom: '16px' }}>
                            <a
                              href="mailto:support@greenyp.com"
                              style={{
                                color: '#16a34a',
                                fontSize: '14px',
                                textDecoration: 'none',
                                marginRight: '16px'
                              }}
                            >
                              Contact Support
                            </a>
                            <a
                              href="https://greenyp.com/terms"
                              style={{
                                color: '#6b7280',
                                fontSize: '14px',
                                textDecoration: 'none',
                                marginRight: '16px'
                              }}
                            >
                              Terms
                            </a>
                            <a
                              href="https://greenyp.com/privacy"
                              style={{
                                color: '#6b7280',
                                fontSize: '14px',
                                textDecoration: 'none'
                              }}
                            >
                              Privacy
                            </a>
                          </div>

                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              color: '#9ca3af'
                            }}
                          >
                            © {new Date().getFullYear()} GreenYP. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

export default BaseEmailTemplate;
