# Linked Lists

```c
typedef struct node
{
	int number;
	struct node *next;
} node;

node *list = NULL;
```

# Trees

```c
typedef struct node
{
	int number;
	struct node *left; // or previous
	struct node *right; // or next
} node;
```

![a sorted sequence of numbers](/static/examples_assets/tree_sequence.png)

![the center value becomes the top of a tree](/static/examples_assets/tree.png)

## Hash table

```c
typedef struct node
{
	char *name;
	char *number;
	struct node *next;
} node;

node *table[26];

unsigned int hash(const char *word)
{
	return toupper(word[0]) - 'A';
}
```

![an array that is assigned each value of the alphabet](/static/examples_assets/hash_table_array.png)

![at each location of the array, a linked list is used](/static/examples_assets/hash_table.png)

## Trie

```c
typedef struct node
{
	struct node *children[26];
	char *number;
} node;

node *trie;
```

![we need $26 × 4 = 104$ `node`s just to store Toad](/static/examples_assets/trie.png)

![other examples](/static/examples_assets/trie_examples.png)
