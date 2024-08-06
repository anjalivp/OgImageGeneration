import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toPng } from 'html-to-image';
import logo1 from './logo1.jpg';

export default function Postpage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const postRef = useRef(null);

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const generateOgImage = async () => {
    console.log('Generating OG Image...');
    if (!title && !content && !image) {
      console.log('No content to generate OG image');
      return;
    }
    try {
      const dataUrl = await toPng(postRef.current, { width: 1200, height: 630 });
      const blob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      console.log('Generated OG Image URL:', url);
      setOgImageUrl(url);
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      generateOgImage();
    }, 500); 
    return () => clearTimeout(debounceTimeout);
  }, [title, content, image]);

  const isAnyFieldFilled = title || content || image || url;

  const styles = {
    container: {
      width: '90%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fefefe',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      height: '150px',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    separator: {
      width: '100%',
      maxWidth: '900px',
      height: '1px',
      backgroundColor: 'black',
      margin: '20px 0',
    },
    post: {
      marginTop: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'aliceblue',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    postTitleContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    postLogo: {
      width: '50px',
      height: '50px',
      marginRight: '10px',
    },
    postTitle: {
      fontSize: '28px',
      marginBottom: '15px',
      color: '#222',
      textAlign: 'left',
    },
    postContent: {
      fontSize: '18px',
      marginBottom: '15px',
      color: '#555',
      lineHeight: '1.6',
      whiteSpace: 'normal',
      wordBreak: 'break-word', 
    },
    postImage: {
      width: '100%', 
      height: 'auto', 
      maxWidth: '800px', 
      maxHeight: '400px', 
      objectFit: 'cover', 
      borderRadius: '8px',
      marginTop: '15px',
    },
    branding: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      fontSize: '16px',
      color: '#666',
    },
    postUrl: {
      display: 'block',
      marginTop: '10px',
      fontSize: '16px',
      color: '#0066cc',
      textDecoration: 'none',
      wordBreak: 'break-all', 
    },
  };

  return (
    <div>
      <div style={styles.container}>
        <Helmet>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={truncateContent(content, 150)} />
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="article" />
        </Helmet>
        <h1 style={{ textAlign: 'center' }}>Create a Post</h1>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />
        </div>
        {isAnyFieldFilled && (
          <>
            <div style={styles.separator}></div>
            <div style={styles.post} ref={postRef}>
              <div style={styles.postTitleContainer}>
                <img src={logo1} alt="Logo" style={styles.postLogo} /> 
                <h2 style={styles.postTitle}>{title}</h2>
              </div>
              <p style={styles.postContent}>{truncateContent(content, 200)}</p>
              {image && <img src={image} alt="Post" style={styles.postImage} />}
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" style={styles.postUrl}>
                  {url}
                </a>
              )}
              <div style={styles.branding}>My Blog</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
