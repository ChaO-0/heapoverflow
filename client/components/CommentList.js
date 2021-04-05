import { Card, CardContent, Box, Typography, NoSsr } from '@material-ui/core';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import useRequest from '../hooks/use-request';
import axios from 'axios';
import { useEffect, useState } from 'react';

const calcVote = (commentVotes, params = 0) => {
	// console.log('calcVotes', commentVotes);
	if (commentVotes !== []) {
		const upVote = commentVotes.filter((vote) => vote?.type === 'up').length;
		const downVote = commentVotes.filter((vote) => vote?.type === 'down')
			.length;
		const totalVote = upVote - downVote - params;

		return totalVote;
	}
	return 0;
};

const CommentList = ({ comment, children }) => {
	const [totalVote, setTotalVote] = useState(calcVote(comment.votes));
	let username;
	if (typeof window !== 'undefined') {
		username = JSON.parse(localStorage.getItem('currentUser')).username;
	}
	const [hasVoted, setHasVoted] = useState(
		comment.votes.find((vote) => vote?.username === username)
	);
	const [voteClickUp, setVoteClickUp] = useState(
		Boolean(hasVoted?.type === 'up')
	);
	const [voteClickDown, setVoteClickDown] = useState(
		Boolean(hasVoted?.type === 'down')
	);
	useEffect(() => {
		username = JSON.parse(localStorage.getItem('currentUser')).username;
	}, []);

	const { doRequest } = useRequest({
		url: `/api/posts/comment/${comment.id}/vote`,
		method: 'post',
	});

	const handleVoteUp = async () => {
		const { votes } = await doRequest({
			voteType: 'up',
		});
		if (voteClickUp !== true) {
			if (hasVoted?.type === 'down') {
				setHasVoted(votes.find((vote) => vote.username === username));
				setVoteClickUp(true);
				setVoteClickDown(false);
			} else {
				setHasVoted(votes.find((vote) => vote.username === username));
				setVoteClickUp(true);
			}
		} else {
			setHasVoted(votes.find((vote) => vote.username === username));
			setVoteClickUp(false);
		}
		setTotalVote(calcVote(votes));
	};

	const handleVoteDown = async () => {
		const { votes } = await doRequest({
			voteType: 'down',
		});
		if (voteClickDown !== true) {
			if (hasVoted?.type === 'up') {
				setHasVoted(votes.find((vote) => vote.username === username));
				setVoteClickDown(true);
				setVoteClickUp(false);
			} else {
				setHasVoted(votes.find((vote) => vote.username === username));
				setVoteClickDown(true);
			}
		} else {
			setHasVoted(votes.find((vote) => vote.username === username));
			setVoteClickDown(false);
		}
		setTotalVote(calcVote(votes));
	};

	return (
		<NoSsr>
			<Card style={{ marginBottom: 20 }}>
				<CardContent>
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Box flexDirection="column" marginRight={3}>
							<ExpandLessIcon
								onClick={handleVoteUp}
								style={{
									marginLeft: 3,
									cursor: 'pointer',
									color: voteClickUp && '#4CC9B0',
								}}
							/>
							<Typography variant="h5" color="secondary" align="center">
								<Box fontWeight={600}>{totalVote}</Box>
							</Typography>
							<Typography
								color="secondary"
								component="div"
								style={{ fontSize: 12 }}
								align="center"
							>
								<Box fontWeight={600} my="auto">
									VOTE
								</Box>
							</Typography>
							<ExpandMoreIcon
								onClick={handleVoteDown}
								style={{
									marginLeft: 3,
									cursor: 'pointer',
									color: voteClickDown && '#4CC9B0',
								}}
							/>
						</Box>
						<Box flexDirection="row" style={{ width: '100%' }}>
							<Box
								flexDirection="row"
								style={{
									borderBottom: '3px solid #707070',
									width: '80%',
									paddingBottom: 10,
								}}
							>
								<Typography
									variant="caption"
									style={{
										color: '#707070',
										fontStyle: 'italic',
									}}
								>
									Oleh: {comment.username}
								</Typography>
							</Box>
							<Box mt={3} style={{ width: '80%' }}>
								{children}
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</NoSsr>
	);
};

export default CommentList;
