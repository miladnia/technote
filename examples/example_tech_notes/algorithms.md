# Binary search tree

```c
typedef struct node
{
	int number;
	struct node *left;
	struct node *right;
} node;

bool search(node *tree, int number)
{
	// Base case
	if (NULL == tree)
	{
		return false;
	}

	if (number < tree->number)
	{
		// Search a sub-tree
		return search(tree->left, number);
	}

	if (number > tree->number)
	{
		// Search a sub-tree
		return search(tree->right, number)
	}

	return true; // number == tree->number
}
```
