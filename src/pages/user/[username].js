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

  return (
    <Layout>
      <Head>
        <title>{ user.name } - GitHub Profiler</title>
        <meta name="description" content={`GitHub profile for ${ user.name }`} />
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