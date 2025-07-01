import React from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface CommentFormProps {
  tweetId: number;
  onSubmit: (data: CommentFormInputs) => void;
}

export interface CommentFormInputs {
  comment: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ tweetId, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormInputs>();

  const handleFormSubmit = (data: CommentFormInputs) => {
    onSubmit(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2, mb: 2, display: 'flex', gap: 1 }}>
      <TextField
        {...register('comment', { required: 'Comment is required' })}
        label="Add a comment"
        variant="outlined"
        size="small"
        fullWidth
        error={!!errors.comment}
        helperText={errors.comment?.message}
        autoFocus
      />
      <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 100 }}>
        Post
      </Button>
    </Box>
  );
};

export default CommentForm;
