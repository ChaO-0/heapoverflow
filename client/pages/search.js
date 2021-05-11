import axios from 'axios';
import { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import moment from 'moment';

const Search = ({ query, tags }) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSearch = async () => {
			try {
				setLoading(true);
				const { data } = await axios.post('/api/search', {
					query,
					tags: tags ? tags.split(',') : null,
				});
				setPosts(data);
				setLoading(false);
			} catch {
				setPosts([]);
				setLoading(false);
			}
		};
		fetchSearch();
	}, [query, tags]);

	return (
		<Layout currentUser={{ username: 'admin' }}>
			<>
				<Typography
					variant="h4"
					color="secondary"
					style={{ fontWeight: 'bold' }}
					gutterBottom
				>
					Pencarian - "{query}"{' '}
					{!loading && posts.length === 0 && ' tidak ditemukan'}
				</Typography>
				{tags && <Typography gutterBottom>Must include: {tags}</Typography>}
				<Typography variant="subtitle2" color="textSecondary" gutterBottom>
					Menemukan {posts.length} hasil
				</Typography>
				{loading
					? 'loading'
					: posts.map((post) => (
							<PostList
								key={post.id}
								title={post.title}
								voteCount={post.voteCount}
								tags={post.tags}
								createdBy={post.username}
								time={moment(post.updatedAt).fromNow()}
								postId={post.id}
								commentCount={post.commentCount}
							/>
					  ))}
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ query }) => {
	const { query: searchQuery } = query;

	let { tags } = query;

	if (tags === undefined) tags = null;

	return {
		props: {
			query: searchQuery,
			tags,
		},
	};
};

export default Search;
