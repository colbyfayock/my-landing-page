import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { v2 as cloudinary } from 'cloudinary';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import images from '@data/images';

import styles from '@styles/User.module.scss'

export default function User({ user, ogImageUrl }) {
  function handleOnTweet(event) {
    event.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}`;
    const message = `Check out ${user.login}'s GitHub profile! ${url}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, 'share-twitter', 'width=550, height=235');
  }
  return (
    <Layout>
      <Head>
        <title>{ user.name } - GitHub Profiler</title>
        <meta name="description" content={`GitHub profile for ${ user.name }`} />
        <meta property="og:title" content={`${ user.name } - GitHub Profiler`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="2024" />
        <meta property="og:image:height" content="1012" />
        <meta property="twitter:title" content={`${ user.name } - GitHub Profiler`} />
        <meta property="twitter:image" content={ogImageUrl} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <Container>
        <h1 className={styles.title}>{ user.name }</h1>

        <p className={styles.username}>
          @{ user.login }
        </p>

        <div className={styles.profile}>
          <Image width="402" height="402" src={user.avatar_url} alt={`${user.login} GitHub avatar`} />
          <div className={styles.profileContent}>
            <p className={styles.profileBio}>
              { user.bio }
            </p>
            <p className={styles.profileCompany}>
              Works at <strong>{ user.company }</strong>
            </p>
            <ul className={styles.profileStats}>
              <li><strong>Public Repos</strong>: { user.public_repos }</li>
              <li><strong>Followers</strong>: { user.followers }</li>
            </ul>
            <p className={styles.profileTwitter}>
              Follow on Twitter at <a href={`https://twitter.com/${ user.twitter_username }`}>@{ user.twitter_username }</a>
            </p>
          </div>
        </div>

        <h2 className={styles.header}>Share This Profile</h2>

        <img width="506" height="253" src={ogImageUrl} style={{ border: 'solid 2px blueviolet' }} alt="Social Card Preview" />

        <p>
          <Button onClick={handleOnTweet}>Share on Twitter</Button>
        </p>

        <h2 className={styles.header}>Try Another Profile</h2>

        <p>
          <Link href="/">
            <a>
              Back to Start
            </a>
          </Link>
        </p>

      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const user = await fetch(`https://api.github.com/users/${params.username}`).then(r => r.json());

  cloudinary.config({
    cloud_name: 'colbydemo'
  });

  const cloudinaryUrl = cloudinary.url('github-social-share-card-background_xfp2m8', {
    width: 1012,
    height: 506,
    transformation: [
      {
        fetch_format: 'auto',
        quality: 'auto'
      },
      {
        overlay: {
          url: user.avatar_url
        }
      },
      {
        flags: 'layer_apply',
        width: 250,
        height: 250,
        gravity: 'north_west',
        x: 150,
        y: 95,
        radius: 250
      },
      {
        color: '#4D57F6',
        crop: 'fit',
        width: 432,
        overlay: {
          font_family: 'Source Sans Pro',
          font_size: 60,
          font_weight: 'bold',
          text: user.name
        },
      },
      {
        color: '#627597',
        crop: 'fit',
        width: 432,
        overlay: {
          font_family: 'Source Sans Pro',
          font_size: 34,
          font_weight: 'semibold',
          text: `@${user.login}`
        },
      },
      {
        flags: 'layer_apply',
        gravity: 'north_west',
        y: 'h + 10'
      },
      {
        color: '#24292F',
        crop: 'fit',
        width: 432,
        overlay: {
          font_family: 'Source Sans Pro',
          font_size: 36,
          font_weight: 'regular',
          text: user.bio,
          crop: 'fit'
        },
      },
      {
        flags: 'layer_apply',
        gravity: 'north_west',
        y: 'h + 18'
      },
      {
        color: '#24292F',
        crop: 'fit',
        width: 432,
        overlay: {
          font_family: 'Source Sans Pro',
          font_size: 28,
          font_weight: 'semibold',
          text: `${user.followers} Followers    ${user.public_repos} Public Repos`,
          crop: 'fit'
        },
      },
      {
        flags: 'layer_apply',
        gravity: 'north_west',
        y: 'h + 24'
      },
      {
        flags: 'layer_apply',
        gravity: 'north_west',
        x: 506,
        y: 80
      }
    ]
  });

  return {
    props: {
      user,
      ogImageUrl: cloudinaryUrl
    }
  }
}